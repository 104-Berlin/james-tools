use std::collections::HashMap;

use reqwest::Client;
use scraper::{Html, Selector};

use crate::models::htw_rooms::{Room, TimeEntry};

pub struct FetchedRoom {
    pub rid: i32,
    pub name: String,
}

pub async fn get_time_entries(room: &Room) -> Vec<TimeEntry> {
    let url = format!(
        "https://lsf.htw-berlin.de/qisserver/rds?state=wplan&act=Raum&pool=Raum&raum.rgid={}",
        room.request_id
    );
    //let cert = std::fs::read("wildcard-self-signed.pem").expect("Reading self signed wildcard");
    //let cert = reqwest::Certificate::from_pem(&cert).expect("Parsing certificate");

    let html = Client::builder()
        //.use_rustls_tls()
        //.add_root_certificate(cert)
        .danger_accept_invalid_certs(true)
        .danger_accept_invalid_hostnames(true)
        .build()
        .unwrap()
        .get(url)
        .send()
        .await
        .expect("Failed to send request")
        .text()
        .await
        .expect("Failed to get response body");

    let doc = Html::parse_document(&html);

    let mut blocked_cols = HashMap::<usize, usize>::new();

    // Select div with class "divcontent"
    let mut content = doc
        .select(&Selector::parse(r#"div.divcontent"#).unwrap())
        .next()
        .expect("Could not find div with class 'divcontent'")
        .select(&Selector::parse(r#"table[cellpadding = "2"] > tbody > tr"#).unwrap())
        .enumerate()
        .filter_map(|(row, row_elem)| {
            // Header row and before 8am
            if row < 2 {
                return None;
            }

            let row = row - 2;

            // Update the blocked cols
            blocked_cols = blocked_cols
                .iter()
                .filter_map(|(col, rowspan)| {
                    if *rowspan == 1 {
                        return None;
                    }

                    Some((*col, rowspan - 1))
                })
                .collect::<HashMap<_, _>>();

            let mut blocks_to_add: Vec<(usize, usize)> = Vec::new();

            // Select the cols aka the days
            // Here we parse the actual data
            let x = row_elem
                .child_elements()
                .enumerate()
                .filter_map(|(col, elem)| {
                    let mut offset = 1;
                    // Ignore first col (spans 2)
                    if col == 0 {
                        return None;
                    }
                    if row % 4 == 0 {
                        if col == 1 {
                            return None;
                        }
                        offset = 2;
                    }
                    let mut col = col - offset;

                    // Calculate the duration based on the rowspan of the cell
                    let rowspan = elem
                        .value()
                        .attr("rowspan")
                        .map(|x| x.parse::<i64>().unwrap())?;

                    // Find the name of the event
                    let name = elem
                        .select(&Selector::parse(r#"table > tbody > tr > td > span > a"#).unwrap())
                        .next()
                        .map(|x| x.inner_html().trim().to_string())?;

                    // Check how many previuos cells are blocked
                    let mut counter = 0;
                    let mut skipped = 0;
                    loop {
                        if blocked_cols.contains_key(&counter) {
                            skipped += 1;
                        }

                        if counter >= col + skipped {
                            col = counter;
                            break;
                        }

                        counter += 1;
                    }

                    blocks_to_add.push((col, rowspan as usize));

                    let weekday = get_weekday(col);
                    let start_time = get_time_from_row(row);
                    let duration = chrono::Duration::minutes(15 * rowspan);
                    let end_time = start_time + duration;

                    Some(TimeEntry {
                        room_id: room.id,
                        name,
                        start_time,
                        end_time,
                        weekday,
                    })
                })
                .collect::<Vec<_>>();

            blocked_cols.extend(blocks_to_add);

            Some(x)
        })
        .flatten()
        .collect::<Vec<_>>();

    content.sort_by(|a, b| {
        a.weekday
            .number_from_monday()
            .cmp(&b.weekday.number_from_monday())
            .then_with(|| a.start_time.cmp(&b.start_time))
    });

    content
}

pub async fn fetch_rids() -> Vec<FetchedRoom> {
    let url = "https://lsf.htw-berlin.de/qisserver/rds?state=wsearchv&search=3&raum.gebid=1112&choice.k_campus.id=y&k_campus.id=4&P_start=0&P_anzahl=1000&_form=display";
    //let cert = std::fs::read("wildcard-self-signed.pem").expect("Reading self signed wildcard");
    //let cert = reqwest::Certificate::from_pem(&cert).expect("Parsing certificate");

    let html = Client::builder()
        //.use_rustls_tls()
        //.add_root_certificate(cert)
        .danger_accept_invalid_certs(true)
        .danger_accept_invalid_hostnames(true)
        .build()
        .unwrap()
        .get(url)
        .send()
        .await
        .expect("Failed to send request")
        .text()
        .await
        .expect("Failed to get response body");

    let doc = Html::parse_document(&html);

    let content_div = doc
        .select(&Selector::parse("div.content_max_portal_qis").unwrap())
        .next()
        .expect("Could not find div.content_max_portal_qis");

    let id_selector = Selector::parse("div.functionnavi + div > a").unwrap();
    let name_selector = Selector::parse("div.functionnavi + div > a > strong").unwrap();

    let rid = content_div.select(&id_selector).map(|e| {
        e.value()
            .attr("href")
            .unwrap()
            .split('&')
            .find(|s| s.starts_with("raum.rgid="))
            .unwrap()
            .split('=')
            .last()
            .unwrap()
    });

    let name = content_div
        .select(&name_selector)
        .map(|e| e.text().next().unwrap());

    // .split("-").next().unwrap().trim()
    rid.zip(name)
        .filter_map(|(rid, name)| {
            let (name, desc) = name.split_once("-")?;

            if !desc.contains("Seminarraum") {
                return None;
            }

            return Some(FetchedRoom {
                rid: rid.parse().unwrap(),
                name: name.to_string(),
            });
        })
        .collect()
}

fn get_time_from_row(row: usize) -> chrono::NaiveTime {
    // Ignore header row and before 8am
    chrono::NaiveTime::from_hms_opt(8, 0, 0).unwrap() + chrono::TimeDelta::minutes(15 * row as i64)
}

fn get_weekday(col: usize) -> chrono::Weekday {
    match col {
        0 => chrono::Weekday::Mon,
        1 => chrono::Weekday::Tue,
        2 => chrono::Weekday::Wed,
        3 => chrono::Weekday::Thu,
        4 => chrono::Weekday::Fri,
        5 => chrono::Weekday::Sat,
        _ => chrono::Weekday::Sun,
    }
}

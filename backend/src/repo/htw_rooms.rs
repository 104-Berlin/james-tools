use chrono::{NaiveTime, Weekday};
use futures::future::join_all;
use sqlx::Acquire;
use tracing::info;

use crate::{
    error::Result,
    htw::room::{self, FetchedRoom},
    models::htw_rooms::{FindEmptyRoom, Room, TimeEntry},
};

pub struct HtwRoomRepo;

impl HtwRoomRepo {
    pub async fn find_empty_rooms<'a, A>(connection: A, room: &FindEmptyRoom) -> Result<Vec<Room>>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut conn = connection.acquire().await?;

        info!(
            "Finding empty rooms, weekday: {:?} from: {:?} to: {:?}",
            room.weekday, room.from, room.to
        );

        let rooms = sqlx::query_as!(
            Room,
            r#"
            SELECT r.id, r.name, r.request_id FROM htw_room r
                WHERE r.id NOT IN (SELECT t.room_id
            FROM time_entry t
            WHERE 
                t.weekday = $1
                AND t.start_time < $2
                AND t.end_time > $3
            ORDER BY t.start_time);
            "#,
            room.weekday as i32,
            room.to,
            room.from
        )
        .fetch_all(conn.as_mut())
        .await?;

        Ok(rooms)
    }

    pub async fn insert_room<'a, A>(connection: A, room: &FetchedRoom) -> Result<Room>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut conn = connection.acquire().await?;

        let room = sqlx::query_as!(
            Room,
            r#"
            INSERT INTO htw_room (name, request_id)
            VALUES ($1, $2)
            RETURNING id, name, request_id;
            "#,
            room.name,
            room.rid
        )
        .fetch_one(conn.as_mut())
        .await?;

        Ok(room)
    }

    pub async fn insert_time_entry<'a, A>(connection: A, entry: &TimeEntry) -> Result<()>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut conn = connection.acquire().await?;

        sqlx::query!(
            r#"
            INSERT INTO time_entry (name, room_id, start_time, end_time, weekday)
            VALUES ($1, $2, $3, $4, $5);
            "#,
            entry.name,
            entry.room_id,
            entry.start_time,
            entry.end_time,
            entry.weekday as i32
        )
        .execute(conn.as_mut())
        .await?;

        Ok(())
    }

    pub async fn clear_rooms<'a, A>(connection: A) -> Result<()>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut conn = connection.acquire().await?;

        sqlx::query!(
            r#"
            DELETE FROM htw_room;
            "#,
        )
        .execute(conn.as_mut())
        .await?;

        Ok(())
    }

    pub async fn clear_time_entries<'a, A>(connection: A) -> Result<()>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut conn = connection.acquire().await?;

        sqlx::query!(
            r#"
            DELETE FROM time_entry;
            "#,
        )
        .execute(conn.as_mut())
        .await?;

        Ok(())
    }

    pub async fn update_rooms<'a, A>(connection: A) -> Result<()>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let start = std::time::Instant::now();
        println!("Updating rooms");

        let mut conn = connection.begin().await?;

        Self::clear_time_entries(conn.as_mut()).await?;
        Self::clear_rooms(conn.as_mut()).await?;

        let rooms = room::fetch_rids().await;
        let mut final_rooms = Vec::with_capacity(rooms.len());
        for room in rooms {
            let room = Self::insert_room(conn.as_mut(), &room).await?;
            final_rooms.push(room);
        }

        let rooms_time_entries =
            join_all(final_rooms.iter().map(|room| room::get_time_entries(room)))
                .await
                .into_iter()
                .flatten()
                .collect::<Vec<_>>();

        for entry in &rooms_time_entries {
            Self::insert_time_entry(conn.as_mut(), entry).await?;
        }

        info!(
            "Inserted {} time entries in {} ms",
            rooms_time_entries.len(),
            start.elapsed().as_millis()
        );
        conn.commit().await?;

        Ok(())
    }
}

use actix_web::{get, post, web};
use sqlx::PgPool;

use crate::{
    error::{Error, Result},
    models::htw_rooms::{FindEmptyRoom, Room},
    repo::htw_rooms::HtwRoomRepo,
};

#[post("/update")]
async fn update(pool: web::Data<PgPool>) -> Result<&'static str> {
    let mut connection = pool.acquire().await?;
    HtwRoomRepo::update_rooms(connection.as_mut()).await?;
    Ok("OK")
}

#[derive(Debug, serde::Deserialize)]
struct Temp {
    weekday: i32,
    from: String,
    to: String,
}

#[get("/empty")]
async fn get_empty_room(
    pool: web::Data<PgPool>,
    room: web::Query<Temp>,
) -> Result<web::Json<Vec<Room>>> {
    let mut connection = pool.acquire().await?;

    let room = FindEmptyRoom {
        weekday: chrono::Weekday::try_from(room.weekday as u8)
            .map_err(|_| Error::BadRequest("Invalid weekday"))?,
        from: chrono::NaiveTime::parse_from_str(&room.from, "%H:%M")
            .map_err(|_| Error::BadRequest("Invalid 'from' time format"))?,
        to: chrono::NaiveTime::parse_from_str(&room.to, "%H:%M")
            .map_err(|_| Error::BadRequest("Invalid 'to' time format"))?,
    };

    let rooms = HtwRoomRepo::find_empty_rooms(connection.as_mut(), &room).await?;
    Ok(web::Json(rooms))
}

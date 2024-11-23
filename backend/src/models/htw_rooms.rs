use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Room {
    pub id: Uuid,
    pub name: String,
    pub request_id: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TimeEntry {
    pub room_id: Uuid,
    pub name: String,
    pub weekday: chrono::Weekday,
    pub start_time: chrono::NaiveTime,
    pub end_time: chrono::NaiveTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FindEmptyRoom {
    pub weekday: chrono::Weekday,
    pub from: chrono::NaiveTime,
    pub to: chrono::NaiveTime,
}

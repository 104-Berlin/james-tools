-- Add up migration script here

CREATE TABLE htw_room (
    id uuid default uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    request_id INTEGER NOT NULL
);

CREATE TABLE time_entry (
    id uuid default uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    room_id uuid NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    weekday INTEGER NOT NULL,
    FOREIGN KEY (room_id) REFERENCES htw_room(id)
);

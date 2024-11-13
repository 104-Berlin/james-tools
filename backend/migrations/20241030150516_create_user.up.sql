-- Add up migration script here
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


create table users (
    id uuid default uuid_generate_v4() primary key, 
    email varchar(255) not null unique, 
    username varchar(255) not null unique,
    first_name varchar(255),
    last_name varchar(255),
    password_hash varchar(255) not null, 
    created_at timestamp not null default now()
);
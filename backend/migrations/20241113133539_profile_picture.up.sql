-- Add up migration script here
-- Add field profile picture to user table
alter table users add column profile_picture

varchar(255);
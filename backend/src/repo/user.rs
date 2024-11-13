use actix_web::web;
use sqlx::Acquire;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    models::user::{User, UserCreate},
};

pub struct UserRepo;

impl UserRepo {
    pub async fn get_by_id<'a, A>(connection: A, id: &Uuid) -> Result<User>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.acquire().await?;

        // Fetch user from database
        let user = sqlx::query_as!(
            User,
            r#"
            SELECT id, email, username, first_name, last_name, password_hash, profile_picture
            FROM users
            WHERE id = $1
            "#,
            id
        )
        .fetch_one(connection.as_mut())
        .await
        .map_err(|_| Error::UserNotFound)?;

        Ok(user)
    }

    pub async fn get_by_email<'a, A>(connection: A, email: &str) -> Result<User>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.acquire().await?;

        // Fetch user from database
        let user = sqlx::query_as!(
            User,
            r#"
            SELECT id, email, username, first_name, last_name, password_hash, profile_picture
            FROM users
            WHERE email = $1
            "#,
            email
        )
        .fetch_one(connection.as_mut())
        .await
        .map_err(|_| Error::UserNotFound)?;

        Ok(user)
    }

    pub async fn get_by_mail_or_username<'a, A>(connection: A, mail_or_user: &str) -> Result<User>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.acquire().await?;

        // Fetch user from database
        let user = sqlx::query_as!(
            User,
            r#"
            SELECT id, email, username, first_name, last_name, password_hash, profile_picture
            FROM users
            WHERE email = $1 OR username = $1
            "#,
            mail_or_user
        )
        .fetch_one(connection.as_mut())
        .await
        .map_err(|_| Error::UserNotFound)?;

        Ok(user)
    }

    /// Create a new user
    ///
    /// # Note
    /// This could also just return a uuid
    pub async fn create<'a, A>(connection: A, user_create: UserCreate) -> Result<User>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.acquire().await?;

        // Insert user into database
        let user = sqlx::query_as!(
            User,
            r#"
            INSERT INTO users (email, username, password_hash, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, username, first_name, last_name, password_hash, profile_picture
            "#,
            user_create.email,
            user_create.username,
            user_create.password_hash,
            user_create.first_name,
            user_create.last_name
        )
        .fetch_one(connection.as_mut())
        .await?;

        Ok(user)
    }

    pub async fn update_picture<'a, A>(connection: A, id: &Uuid, picture: &str) -> Result<User>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.acquire().await?;

        let mut old_image = sqlx::query!(
            r#"
            SELECT profile_picture
            FROM users
            WHERE id = $1 
            "#,
            id
        )
        .fetch_one(connection.as_mut())
        .await?;

        // Delete old image. Ignore if it fails
        if let Some(file_path) = old_image.profile_picture {
            web::block(|| {
                std::fs::remove_file(file_path).ok();
            })
            .await
            .ok();
        }

        // Update user picture in database
        let user = sqlx::query_as!(
            User,
            r#"
            UPDATE users
            SET profile_picture = $1
            WHERE id = $2
            RETURNING id, email, username, first_name, last_name, password_hash, profile_picture
            "#,
            picture,
            id
        )
        .fetch_one(connection.as_mut())
        .await?;

        Ok(user)
    }
}

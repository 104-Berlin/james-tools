use sqlx::Acquire;

use crate::{
    error::Result,
    models::user::{User, UserCreate},
};

pub struct UserRepo;

impl UserRepo {
    pub async fn get_by_mail<'a, A>(connection: A, email: &str) -> Result<User>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.acquire().await?;

        // Fetch user from database
        let user = sqlx::query_as!(
            User,
            r#"
            SELECT id, email, first_name, last_name, password_hash
            FROM users
            WHERE email = $1
            "#,
            email
        )
        .fetch_one(connection.as_mut())
        .await?;

        Ok(user)
    }

    pub async fn create<'a, A>(connection: A, user_create: &UserCreate) -> Result<User>
    where
        A: Acquire<'a, Database = sqlx::Postgres>,
    {
        let mut connection = connection.acquire().await?;

        // Insert user into database
        let user = sqlx::query_as!(
            User,
            r#"
            INSERT INTO users (email, password_hash, first_name, last_name)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, first_name, last_name, password_hash
            "#,
            user_create.email,
            user_create.password_hash,
            user_create.first_name,
            user_create.last_name
        )
        .fetch_one(connection.as_mut())
        .await?;

        Ok(user)
    }
}

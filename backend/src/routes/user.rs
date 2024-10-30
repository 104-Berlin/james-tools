use actix_web::{post, web, HttpResponse};
use chrono::{Duration, Utc};
use sqlx::PgPool;

use crate::{
    auth::{generate_token, validate_password},
    error::{Error, Result},
    models::user::{UserCreate, UserLogin},
    repo::user::UserRepo,
};

#[post("/login")]
pub async fn login(pool: web::Data<PgPool>, login: web::Json<UserLogin>) -> Result<HttpResponse> {
    let login = login.into_inner();
    let mut connection = pool.acquire().await?;

    let user = UserRepo::get_by_mail(&mut connection, &login.email).await?;

    let is_valid = validate_password(&login.password, &user.password_hash).is_ok();
    if is_valid {
        let token = generate_token(login.email, Utc::now() + Duration::days(30))?;
        Ok(HttpResponse::Ok().json(token))
    } else {
        Err(Error::InvalidPassword)
    }
}

#[post("/register")]
pub async fn register(
    pool: web::Data<PgPool>,
    user: web::Json<UserCreate>,
) -> Result<HttpResponse> {
    let user = user.into_inner();
    let mut connection = pool.acquire().await?;

    let user = UserRepo::create(&mut connection, &user).await?;
    Ok(HttpResponse::Ok().json(user))
}

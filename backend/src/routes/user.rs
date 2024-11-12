use actix_web::{get, post, web, HttpResponse};
use chrono::{Duration, Utc};
use sqlx::PgPool;

use crate::{
    auth::{generate_token, validate_password, Claims},
    error::{Error, Result},
    models::user::{User, UserLogin, UserRegister},
    repo::user::UserRepo,
};

#[get("/")]
pub async fn get_user(pool: web::Data<PgPool>, claims: Claims) -> Result<web::Json<User>> {
    let mut connection = pool.acquire().await?;
    let user = UserRepo::get_by_id(&mut connection, &claims.sub).await?;
    Ok(web::Json(user))
}

#[post("/login")]
pub async fn login(pool: web::Data<PgPool>, login: web::Json<UserLogin>) -> Result<HttpResponse> {
    let login = login.into_inner();
    let mut connection = pool.acquire().await?;

    let user = UserRepo::get_by_mail_or_username(&mut connection, &login.email_or_user).await?;

    let is_valid = validate_password(&user.password_hash, &login.password).is_ok();
    if is_valid {
        let token = generate_token(user.id, Utc::now() + Duration::days(30))?;
        Ok(HttpResponse::Ok().json(token))
    } else {
        Err(Error::InvalidPassword)
    }
}

#[post("/register")]
pub async fn register(
    pool: web::Data<PgPool>,
    user: web::Json<UserRegister>,
) -> Result<HttpResponse> {
    let user = user.into_inner();
    let mut connection = pool.acquire().await?;

    let user = UserRepo::create(&mut connection, user.into()).await?;

    let token = generate_token(user.id, Utc::now() + Duration::days(30))?;

    Ok(HttpResponse::Ok().json(token))
}

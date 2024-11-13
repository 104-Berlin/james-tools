use actix_multipart::Multipart;
use actix_web::{get, patch, post, web, HttpResponse};
use chrono::{Duration, Utc};
use futures::StreamExt as _;
use sqlx::PgPool;
use std::io::Write;
use tracing::{info, warn};
use uuid::Uuid;

use crate::{
    auth::{generate_token, validate_password, Claims},
    error::{Error, Result},
    models::user::{User, UserLogin, UserRegister, UserUpdate},
    repo::user::UserRepo,
};

#[get("/current")]
pub async fn get_user(pool: web::Data<PgPool>, claims: Claims) -> Result<web::Json<User>> {
    info!("Getting user {}", claims.sub);
    let mut connection = pool.acquire().await?;
    let user = UserRepo::get_by_id(&mut connection, &claims.sub).await?;
    Ok(web::Json(user))
}

#[patch("/current")]
pub async fn update_user(
    pool: web::Data<PgPool>,
    claims: Claims,
    user: web::Json<UserUpdate>,
) -> Result<HttpResponse> {
    let user = user.into_inner();
    warn!("Updating user {:?}", user);
    let mut connection = pool.acquire().await?;

    UserRepo::update(&mut connection, claims.sub, user).await?;

    Ok(HttpResponse::Ok().finish())
}

// Uploads the profile picture of the user
#[post("/picture")]
pub async fn upload_picture(
    pool: web::Data<PgPool>,
    claims: Claims,
    mut payload: Multipart,
) -> Result<HttpResponse> {
    let mut image_url = String::new();

    while let Some(item) = payload.next().await {
        let mut field = item.unwrap();
        let content_disposition = field.content_disposition().unwrap();
        let filename = content_disposition.get_filename().unwrap();
        let file_extension = filename.split('.').last().unwrap();
        let new_filename = format!("{}.{}", Uuid::new_v4(), file_extension);
        let filepath = format!("./uploads/{}", new_filename);

        info!("Uploading file to {}", filepath);
        let mut f = web::block(|| {
            std::fs::OpenOptions::new()
                .create(true)
                .write(true)
                .append(false)
                .open(filepath)
        })
        .await
        .unwrap()?;

        while let Some(chunk) = field.next().await {
            let data = chunk.unwrap();
            f = web::block(move || f.write_all(&data).map(|_| f))
                .await
                .unwrap()?;
        }

        image_url = format!("/uploads/{}", new_filename);
    }

    // Store in the database
    let mut connection = pool.acquire().await?;
    UserRepo::update_picture(&mut connection, &claims.sub, &image_url).await?;
    Ok(HttpResponse::Ok().finish())
}

#[post("/login")]
pub async fn login(pool: web::Data<PgPool>, login: web::Json<UserLogin>) -> Result<HttpResponse> {
    let login = login.into_inner();
    let mut connection = pool.acquire().await?;

    let user = UserRepo::get_by_mail_or_username(&mut connection, &login.email_or_user).await?;
    info!("User {} logged in", user.username);

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

use actix_web::{delete, get, patch, post, web, HttpResponse};
use sqlx::PgPool;

use crate::{
    auth::Claims,
    error::Result,
    models::budget::{Monthly, MonthlyAdd, MonthlyDelete, MonthlyUpdate},
    repo::budget::BudgetRepo,
};

#[get("/monthly")]
pub async fn get_all(pool: web::Data<PgPool>, claims: Claims) -> Result<web::Json<Vec<Monthly>>> {
    let mut connection = pool.acquire().await?;

    BudgetRepo::monthly_get_all(connection.as_mut(), claims)
        .await
        .map(web::Json)
}

#[post("/monthly")]
pub async fn add(
    pool: web::Data<PgPool>,
    claims: Claims,
    monthly: web::Json<MonthlyAdd>,
) -> Result<HttpResponse> {
    let mut connection = pool.acquire().await?;

    BudgetRepo::insert_monthly(connection.as_mut(), claims, monthly.into_inner()).await?;

    Ok(HttpResponse::Ok().finish())
}

#[patch("/monthly")]
pub async fn update(
    pool: web::Data<PgPool>,
    claims: Claims,
    monthly: web::Json<MonthlyUpdate>,
) -> Result<HttpResponse> {
    let mut connection = pool.acquire().await?;

    BudgetRepo::update_monthly(connection.as_mut(), claims, monthly.into_inner()).await?;

    Ok(HttpResponse::Ok().finish())
}

#[delete("/monthly")]
pub async fn delete_monthly(
    pool: web::Data<PgPool>,
    claims: Claims,
    id: web::Json<MonthlyDelete>,
) -> Result<HttpResponse> {
    let mut connection = pool.acquire().await?;

    BudgetRepo::delete_monthly(connection.as_mut(), claims, &id.into_inner().delete).await?;

    Ok(HttpResponse::Ok().finish())
}

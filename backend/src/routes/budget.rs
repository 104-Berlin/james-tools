use actix_web::{get, patch, post, web, HttpResponse};
use sqlx::PgPool;
use tracing::info;

use crate::{
    auth::Claims,
    error::{Error, Result},
    models::budget::{Monthly, MonthlyAdd, MonthlyUpdate},
    repo::budget::BudgetRepo,
};

#[get("/monthly")]
pub async fn get_all(pool: web::Data<PgPool>, claims: Claims) -> Result<web::Json<Vec<Monthly>>> {
    let mut connection = pool.acquire().await?;

    BudgetRepo::monthly_get_all(connection.as_mut(), &claims.sub)
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

    BudgetRepo::insert_monthly(connection.as_mut(), &claims.sub, monthly.into_inner()).await?;

    Ok(HttpResponse::Ok().finish())
}

#[patch("/monthly")]
pub async fn update(
    pool: web::Data<PgPool>,
    claims: Claims,
    monthly: web::Json<MonthlyUpdate>,
) -> Result<HttpResponse> {
    let mut connection = pool.begin().await?;

    let monthly = monthly.into_inner();

    if !BudgetRepo::monthly_is_users(connection.as_mut(), monthly.id, claims.sub).await? {
        return Err(Error::Unauthorized);
    }

    BudgetRepo::update_monthly(connection.as_mut(), monthly).await?;

    connection.commit().await?;

    Ok(HttpResponse::Ok().finish())
}

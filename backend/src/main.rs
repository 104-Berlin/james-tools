use actix_web::{web, App, HttpServer, Scope};
use config::CONFIG;
use error::Result;
use sqlx::PgPool;

pub mod auth;
pub mod config;
pub mod error;
pub mod models;
pub mod repo;
pub mod routes;

#[actix_web::main]
async fn main() -> Result<()> {
    let pool = connect_to_db().await?;
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(Scope::new("/api").configure(routes::configure))
    })
    .bind(("0.0.0.0", CONFIG.http_port))?
    .run()
    .await?;

    Ok(())
}

async fn connect_to_db() -> Result<PgPool> {
    let pool = PgPool::connect(&CONFIG.db_url).await?;
    Ok(pool)
}

use actix_web::{middleware::Logger, web, App, HttpServer, Scope};
use config::CONFIG;
use error::Result;
use sqlx::{postgres::PgPoolOptions, PgPool};
use tracing_actix_web::TracingLogger;

pub mod auth;
pub mod config;
pub mod error;
pub mod models;
pub mod repo;
pub mod routes;

#[actix_web::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();

    let pool = connect_to_db().await?;
    HttpServer::new(move || {
        App::new()
        .wrap(Logger::default())
        .wrap(TracingLogger::default())
            .app_data(web::Data::new(pool.clone()))
            .service(Scope::new("/api").configure(routes::configure))
    })
    .bind(("0.0.0.0", CONFIG.http_port))?
    .run()
    .await?;

    Ok(())
}

async fn connect_to_db() -> Result<PgPool> {
    println!("Connecting to database: {}", CONFIG.db_url);
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&CONFIG.db_url)
        .await?;
    println!("Connected to database");
    Ok(pool)
}

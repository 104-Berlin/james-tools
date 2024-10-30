use lazy_static::lazy_static;

pub struct Config {
    // Database connection
    pub db_url: String,

    // HTTP Server
    pub http_port: u16,

    // In Production?
    pub production: bool,

    // Auth
    pub auth_secret: String,
}

lazy_static! {
    pub static ref CONFIG: Config = Config {
        db_url: std::env::var("DATABASE_URL")
            .unwrap_or("postgres://postgres:1234@localhost/db".to_string()),
        http_port: std::env::var("PORT")
            .unwrap_or("42069".to_string())
            .parse()
            .expect("PORT must be a number"),
        production: std::env::var("PRODUCTION").is_ok(),
        auth_secret: std::env::var("AUTH_SECRET").unwrap_or("SOME FING AUTH SECRET".to_string()),
    };
}

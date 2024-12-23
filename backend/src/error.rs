use actix_web::ResponseError;
use thiserror::Error;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Error, Debug)]
pub enum Error {
    #[error("Bad request: {0}")]
    BadRequest(&'static str),

    #[error("Database error: {0}")]
    DatabaseError(#[from] sqlx::Error),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("Authentication error: {0}")]
    AuthenticationError(String),

    #[error("Invalid password")]
    InvalidPassword,

    #[error("Unauthorized")]
    Unauthorized,

    #[error("User not found")]
    UserNotFound,

    #[error("No Profile Picture")]
    NoProfilePicture,
}

impl ResponseError for Error {
    fn status_code(&self) -> actix_web::http::StatusCode {
        match self {
            Error::BadRequest(_) => actix_web::http::StatusCode::BAD_REQUEST,
            Error::DatabaseError(_) => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
            Error::IoError(_) => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
            Error::AuthenticationError(_) => actix_web::http::StatusCode::UNAUTHORIZED,
            Error::InvalidPassword | Error::Unauthorized => {
                actix_web::http::StatusCode::UNAUTHORIZED
            }
            Error::UserNotFound | Error::NoProfilePicture => actix_web::http::StatusCode::NOT_FOUND,
        }
    }
}

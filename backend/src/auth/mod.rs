use actix_web::FromRequest;
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, PasswordVerifier, SaltString},
    Argon2, PasswordHash,
};
use chrono::{DateTime, Utc};
use futures::future::Ready;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use uuid::Uuid;

use crate::{
    config::CONFIG,
    error::{Error, Result},
};

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Claims {
    /// User Id
    pub sub: Uuid,
    pub exp: usize,
}

pub fn hash_password(password: &str) -> String {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .expect("Hashing password")
        .to_string()
}

pub fn validate_password(hash: &str, password: &str) -> Result<()> {
    println!("Validating password: {} against {}", password, hash);
    let hash = PasswordHash::new(hash).expect("Hashing password");
    Argon2::default()
        .verify_password(password.as_bytes(), &hash)
        .map_err(|_| crate::error::Error::InvalidPassword)
}

pub fn generate_token(user_id: Uuid, expiration: DateTime<Utc>) -> Result<String> {
    let key = EncodingKey::from_secret(CONFIG.auth_secret.as_bytes());

    let claims = Claims {
        sub: user_id,
        exp: expiration.timestamp() as usize,
    };

    let token = encode(&Header::default(), &claims, &key).map_err(|e| {
        println!("Error encoding token: {:?}", e);
        Error::AuthenticationError("Error encoding token".to_string())
    })?;
    Ok(token)
}

use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::auth::hash_password;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserLogin {
    pub email_or_user: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserRegister {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub username: String,
    pub first_name: String,
    pub last_name: String,
    pub password_hash: String,
    pub profile_picture: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserCreate {
    pub email: String,
    pub username: String,
    pub password_hash: String,
    pub first_name: String,
    pub last_name: String,
}

impl From<UserRegister> for UserCreate {
    fn from(user: UserRegister) -> Self {
        let password_hash = hash_password(&user.password);
        UserCreate {
            email: user.email,
            password_hash,
            username: user.username,
            first_name: "".to_string(),
            last_name: "".to_string(),
        }
    }
}

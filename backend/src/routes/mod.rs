use actix_web::{web, Scope};

pub mod user;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        Scope::new("/user")
            .service(user::get_user)
            .service(user::login)
            .service(user::register),
    );
}

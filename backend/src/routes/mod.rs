use actix_web::{web, Scope};

mod budget;
mod user;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        Scope::new("/user")
            .service(user::get_user)
            .service(user::update_user)
            .service(user::upload_picture)
            .service(user::login)
            .service(user::register),
    );
    cfg.service(
        Scope::new("/budget")
            .service(budget::get_all)
            .service(budget::add)
            .service(budget::update),
    );
}

use actix_web::{web, Scope};

mod budget;
mod htw_rooms;
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
            .service(budget::update)
            .service(budget::delete_monthly),
    );
    cfg.service(
        Scope::new("/htw").service(
            Scope::new("/rooms")
                .service(htw_rooms::update)
                .service(htw_rooms::get_empty_room),
        ),
    );
}

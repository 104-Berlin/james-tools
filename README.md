# full-stack-template
 This is a template for a full stack app

# Used libaries
- [Actix-Web](https://actix.rs)
- [SQLX](https://github.com/launchbadge/sqlx)
- [Serde](https://serde.rs)
- [Serde Json](https://github.com/serde-rs/json)
- [thiserror](https://github.com/dtolnay/thiserror)
- [tokio](https://tokio.rs)
- [chrono](https://github.com/chronotope/chrono)
- [UUID](https://github.com/uuid-rs/uuid)
- [lazy_static](https://github.com/rust-lang-nursery/lazy-static.rs)
- [Argon2](https://docs.rs/argon2)
- [JSON Web Token](https://github.com/Keats/jsonwebtoken)
- [Futures](https://github.com/rust-lang/futures-rs)
- [Hex](https://github.com/KokaKiwi/rust-hex)

# Environtment Vars
- DATABASE_URL  | Connection URL for the database
- PRODUCTION    | Whether we deploy or develop


# How to use

### Database

Add .env file to backend folder with DATABASE_URL="URL_DATABASE_URL"

```
cd backend
cargo install sqlx-cli
sqlx migrate run
```

### SSL

You need to generate openssl certificates

```
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj "/CN=localhost"
``` 
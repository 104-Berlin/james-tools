FROM rust:1.81 AS builder


WORKDIR /app

RUN cargo init --name backend
COPY Cargo.toml .

RUN cargo build --release

RUN rm ./target/release/deps/backend*

COPY ./src ./src
COPY ./.sqlx ./.sqlx
COPY ./migrations ./migrations

ENV SQLX_OFFLINE=1


RUN cargo build --release


# Run the compiled binary

FROM ubuntu:latest

WORKDIR /app

COPY --from=builder /app/target/release/backend .

ENTRYPOINT ["./backend"]
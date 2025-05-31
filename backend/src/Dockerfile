
FROM rust:1.78-slim-buster as builder

WORKDIR /usr/src/app

RUN USER=root cargo new --bin app_dummy_build
WORKDIR /usr/src/app/app_dummy_build

COPY ../Cargo.toml ../Cargo.lock ./

RUN echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm src/*.rs target/release/deps/app_dummy_build* # Clean dummy build artifacts

WORKDIR /usr/src/app # Go back to the main app directory
COPY .. . 
RUN cargo build --release

FROM debian:bullseye-slim

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

WORKDIR /app
USER appuser
COPY --from=builder /usr/src/app/target/release/agri_ai_backend .


EXPOSE 8080
CMD ["./agri_ai_backend"]

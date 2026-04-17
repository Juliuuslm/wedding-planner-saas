# Stage 1: Build
FROM rust:1.83-slim AS builder
WORKDIR /app
# Copy and build dependencies first (caching)
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release && rm -rf src
# Copy source and build
COPY . .
RUN cargo build --release

# Stage 2: Runtime
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/weddingsaas-backend /usr/local/bin/app
EXPOSE 8080
CMD ["app"]

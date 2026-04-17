.PHONY: dev-db dev-backend dev-frontend dev db-stop db-reset

dev-db:
	docker compose up -d

dev-backend:
	cd backend && cargo run

dev-frontend:
	pnpm run dev

dev: dev-db
	@echo "Waiting for PostgreSQL..."
	@sleep 2
	@(cd backend && cargo run) &
	@pnpm run dev

db-stop:
	docker compose down

db-reset:
	docker compose down -v
	docker compose up -d

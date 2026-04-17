.PHONY: dev db-up db-stop db-reset db-migrate db-seed

# Convenience wrappers around pnpm scripts. Prefer `pnpm <script>` directly.

db-up:
	docker compose up -d

db-stop:
	docker compose down

db-reset:
	docker compose down -v
	docker compose up -d

db-migrate:
	pnpm db:migrate

db-seed:
	pnpm db:seed

dev: db-up
	pnpm dev

# Despliegue

Plataforma full-stack Next.js (UI + API en el mismo proceso). Dos servicios en producción:

1. **App Next.js** (Vercel o Railway) — frontend + Route Handlers.
2. **Postgres** (Neon / Supabase / Railway Postgres) — base de datos.

> Railway con backend Rust separado fue la arquitectura anterior. Quedó archivada en la rama `archive/rust-backend`. Este documento refleja la arquitectura actual.

---

## Opción A — Vercel + Neon (recomendada)

### Paso 1 — Crear DB en Neon

1. https://neon.tech → New project → Región LATAM (ej. `aws-us-east-2`).
2. Copiar **pooled connection string** → será `DATABASE_URL`.
3. Copiar **direct connection string** → será `DIRECT_URL` (usado por `prisma migrate deploy`).
4. Neon usa pooler transaction-mode, compatible con `SET LOCAL` usado por RLS.

### Paso 2 — App en Vercel

1. Import Project desde GitHub.
2. Framework preset: Next.js (auto).
3. Environment Variables:
   - `DATABASE_URL` → pooled de Neon
   - `DIRECT_URL` → direct de Neon
   - `AUTH_SECRET` → `openssl rand -base64 32`
   - `AUTH_URL` → URL pública (ej. `https://weddingsaas.vercel.app`)
   - `RESEND_API_KEY` → de https://resend.com
   - `AUTH_EMAIL_FROM` → email verificado en Resend
4. Build command (auto): `prisma generate && next build`. El `postinstall` corre `prisma generate`.
5. Deploy.

### Paso 3 — Migrar + seed

Desde tu máquina con `.env` apuntando a Neon:

```bash
pnpm prisma migrate deploy
pnpm db:seed   # opcional: solo si quieres datos demo en prod
```

---

## Opción B — Railway (monolito)

Un solo servicio con el `Dockerfile` raíz + Postgres plugin.

1. Railway: `+ New Project` → `Deploy from GitHub`.
2. `+ New` → `Database` → `Add PostgreSQL`. Copia `DATABASE_URL` (Railway lo genera).
3. Service settings → Variables:
   - `DATABASE_URL` → reference `${{Postgres.DATABASE_URL}}`
   - `DIRECT_URL` → misma (Railway no tiene pooler)
   - `AUTH_SECRET`, `AUTH_URL`, `RESEND_API_KEY`, `AUTH_EMAIL_FROM` → manual
4. Networking → Generate Domain.
5. El `Dockerfile` hace `prisma generate && next build`. Migraciones se aplican con un hook post-deploy o manual:
   ```bash
   railway run pnpm prisma migrate deploy
   ```

---

## Verificación post-deploy

- App levantada: abrir URL pública → landing.
- Login: magic-link a tu email → entrar a `/dashboard`.
- API health: `curl https://<app>/api/planner/me` con cookie → devuelve planner JSON.
- DB: debería tener al menos el planner del seed si corriste `db:seed`.

---

## Troubleshooting

- **"DATABASE_URL is not set"** en build: agrega las variables de entorno en el proyecto (Vercel/Railway).
- **Auth.js error AdapterError**: verifica que `DATABASE_URL` pueda conectar y que las migraciones Prisma se hayan aplicado (la tabla `users` debe existir).
- **Magic-link no llega**: verifica `RESEND_API_KEY` válido y dominio de email verificado en Resend. El email `AUTH_EMAIL_FROM` debe estar en un dominio verificado.
- **RLS bypasea datos**: si conectas con un rol con `BYPASSRLS` (ej. superuser `postgres`), RLS se ignora. Usa el rol `app_user` creado por la migración `enable_rls` en producción.
- **`SET LOCAL` no funciona con PgBouncer session-mode**: usa transaction-mode (Neon default, Supabase pooler).

---

## Desarrollo local

```bash
pnpm db:up        # docker compose up -d (Postgres local)
pnpm db:migrate   # aplica migraciones pending
pnpm db:seed      # pobla con datos de mock
pnpm dev          # levanta Next en :3000
```

Variables locales en `.env` (git-ignorado). `.env.example` tiene plantilla.

Reset total (destruye DB dev):

```bash
pnpm db:reset     # equivalente docker compose down -v && up
pnpm db:migrate
pnpm db:seed
```

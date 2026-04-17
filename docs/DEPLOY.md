# Despliegue en Railway

Plataforma full-stack: Next.js frontend + Rust/Axum backend + PostgreSQL.

## Arquitectura de servicios

En el proyecto Railway necesitas 3 servicios:

1. **Postgres** (plugin oficial de Railway)
2. **backend** (Rust/Axum) — root directory `/backend`
3. **frontend** (Next.js) — root directory `/`

Railway detecta el `Dockerfile` automáticamente en cada servicio.

## Paso 1 — Crear proyecto

```bash
# Fork o empuja este repo a GitHub
# En Railway: New Project → Deploy from GitHub → selecciona el repo
```

## Paso 2 — Postgres plugin

En el proyecto Railway: `+ New` → `Database` → `Add PostgreSQL`.
Railway crea automáticamente la variable `DATABASE_URL` accesible a los otros servicios vía reference.

## Paso 3 — Servicio backend

1. `+ New` → `GitHub Repo` → mismo repo
2. Settings → Source → **Root Directory**: `/backend`
3. Variables (Service Variables):
   - `DATABASE_URL` → reference a `${{Postgres.DATABASE_URL}}`
   - `PORT` → Railway asigna automáticamente (no se toca)
   - `CORS_ORIGIN` → URL pública del frontend (ej: `https://frontend-production-xxx.up.railway.app`)
   - `RUST_LOG` → `info,weddingsaas_backend=debug`
4. Settings → Networking → **Generate Domain** para obtener URL pública.
5. El servicio Rust corre migrations automáticamente al arrancar (via `sqlx::migrate!`). El seed data se aplica también, así que el primer deploy ya tiene datos para demo.

Healthcheck: `GET /api/health` devuelve `{"status":"ok"}`.

## Paso 4 — Servicio frontend

1. `+ New` → `GitHub Repo` → mismo repo
2. Settings → Source → **Root Directory**: `/` (raíz)
3. Settings → Build → **Build Args** (importante, se bakean en el bundle cliente):
   - `NEXT_PUBLIC_API_URL` → URL del backend + `/api` (ej: `https://backend-production-xxx.up.railway.app/api`)
   - `NEXT_PUBLIC_USE_MOCK` → `false`
4. Variables runtime (opcional, ya están en Dockerfile):
   - `HOSTNAME=0.0.0.0` (ya seteado en Dockerfile)
   - `NODE_ENV=production` (ya seteado)
5. Settings → Networking → **Generate Domain** para URL pública.

Una vez que el frontend tenga URL, copiala a `CORS_ORIGIN` del backend y redeploya el backend.

## Paso 5 — Verificar

- Frontend: abre URL pública → ver dashboard con datos del seed.
- Backend: `curl https://backend.../api/health` → `{"status":"ok"}`
- DB: deberían aparecer 3 eventos, 8 proveedores, 3 clientes, 15 líneas presupuesto, 13 tareas, 6 contratos, 5 ODPs.

## Troubleshooting

**CORS error en browser**: asegura que `CORS_ORIGIN` del backend coincide exactamente con el host del frontend. Backend acepta `Any` origin por default en el código actual (MVP), pero si se endurece, debe tener la URL exacta.

**Frontend muestra "Failed to fetch"**: build args `NEXT_PUBLIC_API_URL` no seteados al momento de build. Revisa Settings → Build → Build Args. Redeploy frontend tras cambiar.

**Migrations fallan**: backend logs dirán "Failed to apply migrations". Revisa `DATABASE_URL`. Si la DB está vacía pero el backend ya corrió, las migrations idempotentes se aplican solas en el siguiente restart.

**Auth middleware**: actualmente hardcodeado al planner seed `a0000000-...`. Para multi-tenant en producción, integrar Clerk (TODO marcado en `backend/src/middleware/auth.rs`).

## Desarrollo local

```bash
# DB local via Docker
make dev-db

# Backend
make dev-backend

# Frontend (otra terminal)
make dev-frontend

# O todo a la vez
make dev
```

Variables locales:
- Frontend: `.env.local` ya tiene `NEXT_PUBLIC_API_URL=http://localhost:8080/api` y `NEXT_PUBLIC_USE_MOCK=false`.
- Backend: `backend/.env` ya tiene `DATABASE_URL=postgres://postgres:postgres@localhost:5432/weddingsaas`.

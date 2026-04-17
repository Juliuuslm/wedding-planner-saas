# Plataforma SaaS Wedding Planners

Plataforma para wedding planners profesionales y sus proveedores en el mercado latinoamericano. Centraliza CRM, presupuesto, timeline, diseño, contratos, catálogo de proveedores y portales para cliente/proveedor en una sola app.

- **Documentación del producto:** [`proyecto-overview.md`](./proyecto-overview.md)
- **Roadmap:** [`roadmap.md`](./roadmap.md)
- **Despliegue:** [`docs/DEPLOY.md`](./docs/DEPLOY.md)
- **Reglas de sesión Claude Code:** [`CLAUDE.md`](./CLAUDE.md)

## Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + Shadcn/ui
- **API:** Next.js Route Handlers (`src/app/api/**/route.ts`) — mismo proceso
- **ORM:** Prisma 7 (`prisma/schema.prisma`) con `@prisma/adapter-pg`
- **DB:** PostgreSQL 16 (Docker local, Neon o Supabase en prod)
- **Auth:** Auth.js v5 (NextAuth) + Prisma adapter — magic-link con Resend, credentials con bcrypt
- **Validación:** Zod (endpoints + formularios)
- **Multitenant:** Row Level Security (RLS) en Postgres

## Quickstart local

```bash
# 1. Instalar deps
pnpm install

# 2. Copiar variables de entorno
cp .env.example .env
# editar .env con tu AUTH_SECRET y RESEND_API_KEY si quieres magic-link

# 3. Levantar Postgres
pnpm db:up

# 4. Aplicar migraciones
pnpm db:migrate

# 5. Sembrar con datos de demo
pnpm db:seed

# 6. Levantar dev server
pnpm dev
```

App en http://localhost:3000. Login con:
- Email: `andrea@amweddingstudio.com`
- Password: `password123`

## Scripts

| Script | Uso |
|---|---|
| `pnpm dev` | Dev server Next.js |
| `pnpm build` | Build prod (incluye `prisma generate`) |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm db:up` | `docker compose up -d` (Postgres) |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:seed` | Poblar DB con `src/data/mock.ts` |
| `pnpm db:studio` | Abrir Prisma Studio |
| `pnpm db:reset` | Reset DB (destruye + recrea + migra) |

## Historial de stack

El proyecto empezó con backend separado en Rust + Axum + SQLx + Clerk. Se migró a monolito Next.js + Prisma + Auth.js + RLS. El código Rust vive en la rama `archive/rust-backend`.

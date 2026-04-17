# CLAUDE.md — Plataforma SaaS Wedding Planners

> Archivo carga automático cada sesión Claude Code.
> Reglas, convenciones y contexto del proyecto.

---

## Contexto del proyecto

Plataforma SaaS web para **wedding planners profesionales y proveedores**, mercado latinoamericano. Centraliza gestión clientes, presupuesto, diseño visual, contratos, hoja de ruta, catálogo proveedores y portal cliente en una app.

Documentación completa: `@proyecto-overview.md`
Roadmap detallado: `@roadmap.md`
Plan migración activo: `/Users/Abraham.Almazan/.claude-stkr/plans/okey-dame-un-plan-cheerful-pond.md`

---

## Tech Stack

> **Migración activa** de backend Rust+Axum separado → monolito Next.js full-stack. Rust legacy en rama `archive/rust-backend`. No tocar `/backend` si aún existe en main.

**Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
**UI Base:** Tailwind CSS 4 + Shadcn/ui
**UI Especializada:** TanStack Table, FullCalendar, DnD Kit, React PDF, cmdk
**API:** Next.js Route Handlers (`src/app/api/**/route.ts`) — mismo proceso que frontend
**ORM:** Prisma 5 (schema en `prisma/schema.prisma`, cliente en `src/lib/prisma.ts`)
**DB:** PostgreSQL 16 (Docker local vía `docker-compose.yml`; Neon o Supabase en prod)
**Auth:** Auth.js v5 (NextAuth) + Prisma adapter — magic-link vía Resend. **NO Clerk.**
**Validación:** Zod en endpoints y formularios
**Multitenant:** RLS Postgres. Request setea `SET LOCAL app.current_planner` dentro transacción. Defensa profundidad: `where: { plannerId }` en Prisma también.
**Deploy:** Vercel (app + API) + Neon/Supabase (DB)

---

## Convenciones de código

- TypeScript estricto todos archivos. Sin `any` salvo casos justificados con comentario.
- Imports con alias `@/` para rutas absolutas desde `src/`.
- Componentes PascalCase. Archivos componentes kebab-case.
- Funciones y variables camelCase.
- Constantes globales SCREAMING_SNAKE_CASE.
- `const` defecto, `let` solo si variable se reasigna.
- No `default export` en archivos con múltiples exports. Named exports.
- Componentes página en `src/app/`, reutilizables en `src/components/`.

---

## Estructura de carpetas

```
prisma/
  schema.prisma           # Modelos Prisma (fuente de verdad schema DB)
  migrations/             # Migraciones Prisma Migrate
  seed.ts                 # Seed dev (usa src/data/mock.ts)
src/
  app/
    (dashboard)/          # Panel planner (layout compartido)
    (portal-cliente)/     # Portal cliente
    (portal-proveedor)/   # Portal proveedor
    api/                  # Route Handlers (endpoints REST)
      auth/[...nextauth]/ # Handler Auth.js
      clients/ events/ vendors/ contracts/ tasks/ odps/ packages/ planner/me/
    page.tsx              # Landing
  components/
    ui/ layout/ dashboard/
    eventos/ presupuesto/ timeline/ proveedores/ contratos/ clientes/ diseno/ portal/
  lib/
    prisma.ts             # Cliente Prisma singleton
    auth.ts               # Config Auth.js v5 + Prisma adapter
    db-tenant.ts          # withTenant(plannerId, fn) — transacción + SET LOCAL
    api-handler.ts        # Wrapper Route Handler: sesión, plannerId, errores
    api-client.ts         # Cliente fetch tipado (client components)
  types/                  # Tipos UI (tipos DB desde @prisma/client)
  data/                   # Mock data (usado solo por prisma/seed.ts)
  hooks/                  # Custom hooks React
  middleware.ts           # Guardias rutas por rol (planner/client/vendor)
```

---

## Sistema de diseño

**Fuente principal:** Plus Jakarta Sans (Google Fonts)
**Fuente código/monospace:** JetBrains Mono

**Paleta colores** (en `tailwind.config.ts` + CSS vars):
- `brand`: #1A1A2E (navy profundo — primario marca)
- `brand-light`: #16213E
- `accent`: #C9A96E (oro cálido — premium)
- `accent-light`: #E8D5B0
- `surface`: #FAFAF9 (fondo principal)
- `surface-2`: #F4F3F0 (fondo cards)
- `border`: #E5E3DC
- `text-primary`: #1C1B1A
- `text-secondary`: #6B6860
- `text-muted`: #A09D96
- `success`: #2D6A4F
- `warning`: #B5830A
- `danger`: #C0392B

**Estética:** Sofisticado y funcional. Similar Linear/Vercel dashboard con calidez. Sin gradientes morados genéricos. Sin rosa cliché bodas. Herramienta profesional, no revista nupcial.

**Espaciado:** Escala Tailwind. Generoso (padding 6-8 cards).
**Radios:** `rounded-lg` cards, `rounded-md` inputs/botones, `rounded-full` avatares/badges.
**Sombras:** Sutiles. `shadow-sm` defecto, `shadow-md` elevados.
**Animaciones:** CSS transitions 200-300ms. Stagger listas. Micro-interacciones hover. Respetar `prefers-reduced-motion`.

---

## Datos mock y seed

`src/data/mock.ts` = fuente que alimenta `prisma/seed.ts`. Datos coherentes:
- Planner: "Andrea Morales" — "AM Wedding Studio"
- 3 eventos activos con nombres/fechas/estados distintos
- 5-8 proveedores categorías variadas
- 2-3 clientes estados diferentes (activo/completado/prospecto)

Páginas que aún lean `mock.ts` directo = legacy. Migrar a queries Prisma (server components) o fetch API (client components).

Modelos canónicos viven en `prisma/schema.prisma`. Tipos desde `@prisma/client`. `src/types/` solo para tipos UI que no mapean 1:1 con DB.

---

## Multitenancy y RLS

Toda tabla tenant-scoped lleva `planner_id`. Policies RLS filtran por `current_setting('app.current_planner')`. Reglas duras:

1. **Nunca** queries Prisma fuera de `withTenant(plannerId, fn)` en endpoints autenticados. Helper abre transacción + `SET LOCAL app.current_planner`.
2. **Además** `where: { plannerId }` explícito en query Prisma. Defensa profundidad.

Portales cliente/proveedor: sesión Auth.js lleva `role` + `scopeId` (clienteId o vendorId). Policies extra filtran por scope según rol.

---

## Comandos útiles

```bash
pnpm dev             # Dev server (front + API)
pnpm build           # Build prod
pnpm type-check      # tsc --noEmit
pnpm lint            # ESLint
pnpm db:up           # docker compose up -d (Postgres local)
pnpm db:migrate      # prisma migrate dev
pnpm db:seed         # Poblar DB con mock.ts
pnpm db:studio       # Prisma Studio
pnpm db:reset        # Reset completo
```

---

## Reglas de trabajo

- Correr `pnpm type-check` tras cambios código.
- Cambios `prisma/schema.prisma` → `pnpm db:migrate` + commit migración generada.
- Verificar visual en navegador tras cambios UI.
- Un componente por archivo. No mezclar lógica negocio con presentación.
- Endpoints nuevos: validar input con Zod + envolver con `withTenant` (o wrapper `api-handler`).
- Nunca rol `postgres` superuser desde app. Connection string usa `app_user` (sin BYPASSRLS).
- Nunca push `main` sin pasar `pnpm type-check` + `pnpm lint`.
- Consultar plan migración en `/Users/Abraham.Almazan/.claude-stkr/plans/okey-dame-un-plan-cheerful-pond.md` antes cambios grandes.

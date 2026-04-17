# CLAUDE.md — Plataforma SaaS Wedding Planners

> Este archivo se carga automáticamente en cada sesión de Claude Code.
> Contiene las reglas, convenciones y contexto del proyecto.

---

## Contexto del proyecto

Plataforma SaaS web para **wedding planners profesionales y sus proveedores**, orientada al mercado latinoamericano. El producto centraliza gestión de clientes, presupuesto, diseño visual, contratos, hoja de ruta, catálogo de proveedores y portal del cliente en una sola aplicación.

Documentación completa del proyecto: `@proyecto-overview.md`  
Roadmap detallado: `@roadmap.md`

---

## Tech Stack

> **Nota:** El proyecto está en migración activa desde un backend separado en Rust+Axum hacia un monolito Next.js full-stack. El código Rust legacy vive en la rama `archive/rust-backend`. No tocar `/backend` en `main` si aún existe; se elimina como parte de la migración.

**Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
**UI Base:** Tailwind CSS 4 + Shadcn/ui
**UI Especializada:** TanStack Table, FullCalendar, DnD Kit, React PDF, cmdk
**API:** Next.js Route Handlers (`src/app/api/**/route.ts`) — mismo proceso que el frontend
**ORM:** Prisma 5 (schema en `prisma/schema.prisma`, cliente en `src/lib/prisma.ts`)
**Base de datos:** PostgreSQL 16 (Docker local vía `docker-compose.yml`; Neon o Supabase en producción)
**Auth:** Auth.js v5 (NextAuth) con Prisma adapter — magic-link vía Resend, credentials opcional. **NO Clerk.**
**Validación:** Zod en endpoints y formularios
**Multitenant:** Row Level Security (RLS) en Postgres. Cada request setea `SET LOCAL app.current_planner` dentro de una transacción; defensa en profundidad con `where: { plannerId }` en Prisma.
**Deploy:** Vercel (app + API) + Neon/Supabase (DB)

---

## Convenciones de código

- TypeScript estricto en todos los archivos. Sin `any` salvo casos justificados con comentario.
- Imports con alias `@/` para rutas absolutas desde `src/`.
- Componentes en PascalCase. Archivos de componentes en kebab-case.
- Funciones y variables en camelCase.
- Constantes globales en SCREAMING_SNAKE_CASE.
- Usar `const` por defecto, `let` solo cuando la variable se reasigna.
- No usar `default export` en archivos con múltiples exports. Usar named exports.
- Los componentes de página van en `src/app/`, los componentes reutilizables en `src/components/`.

---

## Estructura de carpetas

```
prisma/
  schema.prisma           # Modelos Prisma (fuente de verdad del schema DB)
  migrations/             # Migraciones generadas por Prisma Migrate
  seed.ts                 # Seed de datos de desarrollo (coherente con src/data/mock.ts)
src/
  app/
    (dashboard)/          # Rutas del panel del planner (layout compartido)
    (portal-cliente)/     # Rutas del portal del cliente
    (portal-proveedor)/   # Rutas del portal del proveedor
    api/                  # Route Handlers — endpoints REST del backend
      auth/[...nextauth]/ # Handler Auth.js
      clients/            # CRUD clientes
      events/             # CRUD eventos + sub-recursos (budget, tasks, contracts, odps)
      vendors/            # CRUD proveedores
      contracts/          # CRUD contratos
      tasks/              # Update/delete/reorder de tareas
      odps/               # CRUD ODPs (Órdenes de Desempeño)
      packages/           # CRUD paquetes
      planner/me/         # Perfil del planner autenticado
    page.tsx              # Landing page
  components/
    ui/                   # Componentes base de Shadcn/ui
    layout/               # Shell, sidebar, header, breadcrumbs
    dashboard/            # Componentes del dashboard
    eventos/ presupuesto/ timeline/ proveedores/ contratos/ clientes/ diseno/ portal/
  lib/
    prisma.ts             # Cliente Prisma singleton
    auth.ts               # Config Auth.js v5 + Prisma adapter
    db-tenant.ts          # Helper `withTenant(plannerId, fn)` que abre transacción + SET LOCAL
    api-handler.ts        # Wrapper de Route Handlers: valida sesión, extrae plannerId, maneja errores
    api-client.ts         # Cliente fetch tipado para client components
  types/                  # Tipos de dominio (los tipos DB vienen de @prisma/client)
  data/                   # Mock data — usado solo por prisma/seed.ts
  hooks/                  # Custom hooks de React
  middleware.ts           # Guardias de rutas por rol (planner/client/vendor)
```

---

## Sistema de diseño

**Fuente principal:** Plus Jakarta Sans (importar desde Google Fonts)  
**Fuente código/monospace:** JetBrains Mono  

**Paleta de colores** (definir en `tailwind.config.ts` y CSS variables):
- `brand`: #1A1A2E (navy profundo — color primario de la marca)
- `brand-light`: #16213E
- `accent`: #C9A96E (oro cálido — acento premium)
- `accent-light`: #E8D5B0
- `surface`: #FAFAF9 (fondo principal)
- `surface-2`: #F4F3F0 (fondo de cards)
- `border`: #E5E3DC
- `text-primary`: #1C1B1A
- `text-secondary`: #6B6860
- `text-muted`: #A09D96
- `success`: #2D6A4F
- `warning`: #B5830A
- `danger`: #C0392B

**Estética objetivo:** Sofisticado y funcional. Similar a Linear o Vercel dashboard pero con calidez. Nada de gradientes morados genéricos. No rosa cliché de bodas. Es una herramienta profesional, no una revista nupcial.

**Espaciado:** Usar la escala de Tailwind. Preferir espaciado generoso (padding 6-8 en cards).  
**Radios:** `rounded-lg` para cards, `rounded-md` para inputs y botones, `rounded-full` para avatares y badges.  
**Sombras:** Sutiles. Usar `shadow-sm` por defecto, `shadow-md` para elementos elevados.  
**Animaciones:** CSS transitions suaves (200-300ms). Stagger en listas. Micro-interacciones en hover.

---

## Datos mock y seed

Datos coherentes usados en desarrollo:
- Planner: "Andrea Morales" — empresa "AM Wedding Studio"
- 3 eventos activos con nombres, fechas y estados distintos
- 5-8 proveedores con categorías variadas
- 2-3 clientes en estados diferentes (activo, completado, prospecto)

`src/data/mock.ts` es la fuente que usa `prisma/seed.ts` para poblar la DB local. Durante la migración, páginas que aún lean directo de `mock.ts` son legacy y deben migrar a queries Prisma (server components) o fetch al API (client components).

Los modelos canónicos viven en `prisma/schema.prisma`. Los tipos se importan desde `@prisma/client`. `src/types/` se usa solo para tipos de UI que no mapean 1:1 con la DB.

---

## Multitenancy y RLS

Toda tabla tenant-scoped lleva `planner_id`. Policies RLS filtran por `current_setting('app.current_planner')`. Dos reglas duras:

1. **Nunca** hacer queries Prisma fuera de `withTenant(plannerId, fn)` en endpoints autenticados. El helper abre transacción y ejecuta `SET LOCAL app.current_planner`.
2. **Además** pasar `where: { plannerId }` explícito en la query Prisma. Defensa en profundidad.

Portales cliente/proveedor: la sesión Auth.js lleva `role` y `scopeId` (clienteId o vendorId). Policies adicionales filtran por scope según rol.

---

## Comandos útiles

```bash
pnpm dev             # Servidor de desarrollo (frontend + API)
pnpm build           # Build de producción
pnpm type-check      # Verificar tipos TypeScript
pnpm lint            # ESLint
pnpm db:up           # docker compose up -d (Postgres local)
pnpm db:migrate      # prisma migrate dev
pnpm db:seed         # Poblar DB con datos de mock.ts
pnpm db:studio       # Abrir Prisma Studio
pnpm db:reset        # Reset completo (down -v && up && migrate && seed)
```

---

## Reglas de trabajo

- Correr `pnpm type-check` después de cambios de código.
- Tras cambios en `prisma/schema.prisma`: `pnpm db:migrate` + commitear el archivo de migración generado.
- Verificar visualmente en el navegador tras cambios de UI.
- Un componente por archivo. Sin mezclar lógica de negocio con presentación.
- Endpoints nuevos: validar input con Zod + envolver con `withTenant` (o el wrapper `api-handler`).
- Nunca usar el rol `postgres` superuser desde la app. Connection string usa `app_user` (sin BYPASSRLS).
- Nunca hacer push a `main` sin pasar `pnpm type-check` y `pnpm lint`.
- Consultar el plan de migración activo en `/Users/Abraham.Almazan/.claude-stkr/plans/okey-dame-un-plan-cheerful-pond.md` antes de introducir cambios grandes.

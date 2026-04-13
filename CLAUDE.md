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

**Frontend:** Next.js 14 (App Router) + React 18 + TypeScript  
**UI Base:** Tailwind CSS + Shadcn/ui  
**UI Especializada:** TanStack Table, FullCalendar, DnD Kit, React PDF  
**Backend (fase 2):** Rust + Axum  
**Base de datos (fase 2):** PostgreSQL + SQLx  
**Auth (fase 2):** Clerk  

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
src/
  app/                    # Rutas de Next.js (App Router)
    (dashboard)/          # Rutas del panel del planner (con layout compartido)
    (portal-cliente)/     # Rutas del portal del cliente
    (portal-proveedor)/   # Rutas del portal del proveedor
    page.tsx              # Landing page
  components/
    ui/                   # Componentes base de Shadcn/ui
    layout/               # Shell, sidebar, header, breadcrumbs
    dashboard/            # Componentes del dashboard
    eventos/              # Módulo de eventos/bodas
    presupuesto/          # Módulo de presupuesto
    timeline/             # Módulo de hoja de ruta
    proveedores/          # Módulo de proveedores
    contratos/            # Módulo de contratos
    clientes/             # CRM de clientes
    diseno/               # Módulo de diseño (Canva placeholder)
    portal/               # Portales de cliente y proveedor
  lib/                    # Utilidades, helpers, configuraciones
  types/                  # Tipos TypeScript compartidos
  data/                   # Mock data para el prototipo
  hooks/                  # Custom hooks de React
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

## Datos mock

Todos los datos mock van en `src/data/`. Usar datos coherentes a lo largo de todo el prototipo:
- Planner: "Andrea Morales" — empresa "AM Wedding Studio"
- 3 eventos activos con nombres, fechas y estados distintos
- 5-8 proveedores con categorías variadas
- 2-3 clientes en estados diferentes (activo, completado, prospecto)

Los tipos de los datos mock deben estar definidos en `src/types/` y ser los mismos tipos que usará el backend en fase 2.

---

## Comandos útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run type-check   # Verificar tipos TypeScript
npm run lint         # ESLint
```

---

## Reglas de trabajo

- Siempre correr `npm run type-check` después de cambios de código.
- Verificar visualmente en el navegador después de cambios de UI.
- Un componente por archivo. Sin mezclar lógica de negocio con presentación.
- Los datos mock NUNCA van hardcodeados en componentes. Siempre importar de `src/data/`.
- Mantener consistencia visual entre todas las pantallas del prototipo.
- En el prototipo (Fase 1), sin llamadas a APIs reales. Todo con datos mock.

# Roadmap — Plataforma SaaS Wedding Planners

> Versión: 1.0 — Abril 2026  
> Estado: Fase de planeación / Pre-desarrollo

---

## Tabla de contenidos

1. [Fase 1 — Prototipo Visual](#fase-1--prototipo-visual)
2. [Fase 2 — MVP Web](#fase-2--mvp-web)
3. [Fases futuras](#fases-futuras)

---

## Fase 1 — Prototipo Visual

**Objetivo:** Tener todas las pantallas navegables con datos mockeados, sin backend real.  
**Resultado:** Producto validable con planners y proveedores reales antes de invertir en backend.

---

### Paso 1 — Setup del proyecto

- [ ] Inicializar repositorio con Next.js 14 (App Router) + TypeScript
- [ ] Instalar y configurar Tailwind CSS
- [ ] Instalar Shadcn/ui y generar componentes base
- [ ] Definir tokens de diseño: colores, tipografía, espaciado, radios
- [ ] Configurar estructura de carpetas del proyecto
- [ ] Configurar ESLint + Prettier
- [ ] Primer commit y repositorio en GitHub

---

### Paso 2 — Layout base y navegación

- [ ] Construir sidebar de navegación con todas las secciones principales
- [ ] Header con avatar, nombre del planner y menú de perfil
- [ ] Breadcrumbs por sección
- [ ] Área de contenido principal responsiva
- [ ] Definir y crear todas las rutas en Next.js (páginas vacías)
- [ ] Estado activo en sidebar según ruta actual
- [ ] Versión mobile del layout (menú colapsable)

---

### Paso 3 — Dashboard del planner

- [ ] Resumen de eventos activos con estado visual
- [ ] Tareas pendientes del día
- [ ] Próximos pagos (clientes y proveedores)
- [ ] Alertas y notificaciones recientes
- [ ] Accesos rápidos a las secciones más usadas
- [ ] Datos mockeados coherentes con el resto del prototipo

---

### Paso 4 — CRM de clientes

- [ ] Lista de clientes con búsqueda y filtros (estado, fecha, paquete)
- [ ] Tarjetas de cliente con datos clave visibles
- [ ] Perfil detallado: datos de contacto, notas, historial de eventos
- [ ] Estado del cliente (prospecto, activo, completado)
- [ ] Calendario de agenda de bodas (vista mes y semana)
- [ ] Botón de nuevo cliente con formulario mockeado

---

### Paso 5 — Módulo de eventos (perfil de boda)

- [ ] Pantalla central con tabs: General, Presupuesto, Timeline, Proveedores, Contratos, Diseño, Portal
- [ ] Header del evento con nombre, fecha, estado y progreso general
- [ ] Datos generales: tipo de evento, número de invitados, venue, paquete
- [ ] Navegación fluida entre tabs
- [ ] Indicadores de completitud por sección
- [ ] Botón de nuevo evento con formulario mockeado

---

### Paso 6 — Módulo de presupuesto

- [ ] Tabla editable estilo spreadsheet con TanStack Table
- [ ] Categorías expandibles (venue, catering, florería, fotografía, etc.)
- [ ] Columnas: concepto, proveedor asignado, monto estimado, monto real, pagado, saldo
- [ ] Cálculos automáticos de subtotales y total general
- [ ] Barra de progreso de presupuesto usado vs total
- [ ] Indicador visual de discrepancias entre estimado y real
- [ ] Botón de exportar a Excel (visual, funcional en MVP)
- [ ] Placeholder visual para la referencia de diseño (Canva)

---

### Paso 7 — Timeline / Hoja de ruta

- [ ] Vista Gantt con FullCalendar mostrando tareas en el tiempo
- [ ] Agrupación por fases del evento (contratación, diseño, logística, día del evento, post-evento)
- [ ] Planificación hacia atrás desde la fecha del evento
- [ ] Drag & drop de tareas con DnD Kit
- [ ] Asignación de responsable por tarea
- [ ] Estados de tarea: pendiente, en progreso, completada, atrasada
- [ ] Vista alternativa: lista de tareas por fecha
- [ ] Filtros por responsable y estado

---

### Paso 8 — Módulo de proveedores (catálogo)

- [ ] Catálogo general organizado por categorías
- [ ] Búsqueda y filtros (categoría, precio, disponibilidad, calificación)
- [ ] Tarjeta de proveedor con datos clave, foto y calificación
- [ ] Perfil detallado: datos, servicios, precios, historial de eventos, notas
- [ ] Vista de proveedores asignados a un evento específico
- [ ] ODP (Orden de Desempeño) por proveedor: descripción, monto, fecha, estado
- [ ] Botón de nuevo proveedor con formulario mockeado

---

### Paso 9 — Portal del proveedor

- [ ] Ruta separada que simula la vista del proveedor
- [ ] Lista de ODPs asignadas con estado
- [ ] Detalle de cada ODP: evento, fecha, requerimientos, monto
- [ ] Eventos en los que participa el proveedor
- [ ] Estado de sus contratos y pagos pendientes
- [ ] Sin acceso a datos de otros proveedores ni del planner
- [ ] Diseño diferenciado visualmente del panel del planner

---

### Paso 10 — Módulo de contratos

- [ ] Lista de contratos del evento con estado (borrador, enviado, firmado)
- [ ] Vista de template de contrato con campos auto-completados (nombre, paquete, montos, fechas)
- [ ] Sección de firma digital (visual, funcional en MVP)
- [ ] Generación de PDF con React PDF (funcional desde el prototipo)
- [ ] Contratos de proveedores separados de contratos con clientes
- [ ] Historial de versiones del contrato

---

### Paso 11 — Portal del cliente

- [ ] Ruta separada con diseño orientado al cliente final
- [ ] Progreso del evento en porcentaje con hitos visuales
- [ ] Próximos hitos y fechas importantes
- [ ] Estado de pagos: realizados, pendientes, próximos
- [ ] Sección de aprobaciones de diseño (galería de assets)
- [ ] Mensaje directo al planner
- [ ] Sin acceso a presupuesto interno ni datos de proveedores
- [ ] Diseño más estético, menos operacional que el panel del planner

---

### Paso 12 — Módulo de diseño (Canva placeholder)

- [ ] Sección dentro del evento para referencias visuales
- [ ] Placeholder visual del área donde irá el editor Canva embebido
- [ ] Galería de assets del evento (imágenes subidas manualmente en prototipo)
- [ ] Etiquetas de categoría por asset (paleta de colores, flores, decoración, invitaciones)
- [ ] Vinculación visual entre asset y proveedor responsable

---

### Paso 13 — Configuración y paquetes

- [ ] Perfil del planner: datos de empresa, logo, colores de marca
- [ ] Gestión de paquetes: nombre, descripción, precio, servicios incluidos
- [ ] Gestión del equipo: invitar miembros, asignar roles y permisos
- [ ] Preferencias de notificación
- [ ] Configuración de moneda y zona horaria

---

### Paso 14 — Revisión y polish del prototipo

- [ ] Verificar que todos los flujos de navegación estén conectados
- [ ] Revisar consistencia visual entre todas las pantallas
- [ ] Asegurar que los datos mockeados cuenten una historia coherente en todo el prototipo
- [ ] Revisar responsividad en móvil y tablet
- [ ] Corregir inconsistencias de espaciado, tipografía y colores
- [ ] Preparar guión de demo para validación con usuarios reales

---

## Fase 2 — MVP Web (Next.js full-stack + Prisma + Auth.js + RLS)

**Objetivo:** Conectar el prototipo con datos reales, auth y multitenant con RLS.
**Resultado:** Plataforma funcional que un planner real puede usar; primer cliente en producción.

> **Nota histórica:** Originalmente Fase 2 iba a usar un backend separado en Rust+Axum+SQLx+Clerk. Esa decisión se revirtió: Tauri no requiere backend Rust (shell nativo independiente del API server), Clerk cuesta, iterar en dos stacks ralentizó el descubrimiento de producto. El código Rust se preservó en la rama `archive/rust-backend` como referencia. Ver [plan de migración](/.claude-stkr/plans/okey-dame-un-plan-cheerful-pond.md).

---

### M1 — Fundamentos Prisma + Auth.js

- [x] Portar schema SQL (11 tablas) a `prisma/schema.prisma`
- [x] `prisma.config.ts` con datasource url (Prisma 7)
- [x] `src/lib/prisma.ts` singleton con `@prisma/adapter-pg`
- [x] `src/lib/auth.ts` con NextAuth v5 + PrismaAdapter
- [x] Providers: Credentials (bcrypt) + Resend (magic-link)
- [x] `prisma/seed.ts` portado desde `src/data/mock.ts`
- [x] Scripts `db:up`, `db:migrate`, `db:seed`, `db:studio` en `package.json`

### M2 — RLS + tenant plumbing

- [x] Migración `enable_rls`: habilitar RLS en 10 tablas
- [x] Funciones helper `app_current_planner/scope/role`
- [x] Policies por defecto: `planner_id = app_current_planner()`
- [x] Policies extra para portales cliente/proveedor (role + scope)
- [x] Rol `app_user` (sin BYPASSRLS) con permisos CRUD
- [x] Helper `withTenant(ctx, fn)` en `src/lib/db-tenant.ts`
- [x] Wrapper `authenticated(handler)` en `src/lib/api-handler.ts`

### M3 — Route Handlers Next.js

- [x] 23 archivos `route.ts` en `src/app/api/**` (25 endpoints)
- [x] Validadores Zod compartidos en `src/lib/validators.ts`
- [x] Todos los endpoints envueltos con `authenticated` + `withTenant`
- [x] Defensa en profundidad: `where: { plannerId }` en cada query

### M4 — Conectar frontend

- [x] `src/lib/api/client.ts` apunta a `/api` (same-origin)
- [x] Fetch con `credentials: 'include'` para cookie Auth.js

### M5 — Must-have para MVP público

- [ ] **Auth & tenancy:** signup planner, login magic-link, logout, invitación cliente/proveedor por email
- [ ] **CRM clientes:** CRUD con estados, búsqueda, filtros, validación Zod + react-hook-form
- [ ] **Eventos:** CRUD con tabs, cálculo de progreso desde tareas, calendario mensual
- [ ] **Presupuesto:** tabla editable (TanStack), autosave debounce, barra de pagos
- [ ] **Timeline:** CRUD tareas, vista Gantt, drag&drop persistente, filtros
- [ ] **Proveedores:** CRUD 14 categorías, asignación a eventos, ODPs
- [ ] **Contratos:** CRUD, estados, PDF con React PDF
- [ ] **Portal cliente:** progreso con hitos, pagos (read-only), aprobación de diseños
- [ ] **Portal proveedor:** lista ODPs, detalle con acciones confirmar/solicitar cambio
- [ ] **UX foundation:** skeletons, empty states, error boundaries, focus rings, reduced-motion, responsive, toasts, confirmación destructiva
- [ ] **Configuración:** perfil planner, CRUD paquetes
- [ ] **Deploy:** Vercel + Neon/Supabase + dominio

---

## Fase 3 — Nice-to-have (post-MVP)

### 3a — Productividad

- [ ] Exportar presupuesto a Excel (SheetJS)
- [ ] Historial de versiones de contratos
- [ ] Notificaciones in-app
- [ ] Email transaccional en cambios de estado (Resend)
- [ ] Job queue (Inngest o pg-boss): recordatorios, alertas, resumen semanal
- [ ] Búsqueda global ⌘K (cmdk)
- [ ] Atajos de teclado
- [ ] Dashboard con KPIs reales
- [ ] Firma digital en contrato (canvas)

### 3b — Colaboración

- [ ] Gestión equipo con roles (owner/editor/viewer)
- [ ] Asignación de tareas a miembros reales (no hardcoded)
- [ ] Comentarios en tareas
- [ ] Log de actividad por evento
- [ ] Mensajes real-time en portal cliente (SSE o Pusher)

### 3c — Diseño & assets

- [ ] Upload a Cloudflare R2 o Vercel Blob
- [ ] Galería por evento con tags
- [ ] Integración Canva Connect (OAuth + embed)

### 3d — Pagos & automatización

- [ ] Stripe / Mercado Pago para anticipos
- [ ] Link de pago por contrato
- [ ] Webhooks → actualiza estado pago en `budget_items`
- [ ] Recordatorios por email + WhatsApp (Twilio o WhatsApp Business API)
- [ ] Factura PDF automática

### 3e — Directorio público

- [ ] Página pública `/planners/[slug]` con portfolio
- [ ] SEO (metadata, sitemap, OG tags)
- [ ] Formulario de contacto → lead

### 3f — Internacionalización

- [ ] i18n con next-intl (es-MX, es-CO, es-AR, pt-BR)
- [ ] Formato moneda/fecha localizado
- [ ] Templates para eventos corporativos / quinceañeras

---

## Fase 4 — Aplicación de escritorio

- [ ] Empaquetar con Tauri (`src-tauri/`), mismo frontend
- [ ] Distribución macOS / Windows / Linux
- [ ] Modo offline parcial (cache read-only)
- [ ] Notificaciones OS nativas

---

## Fase 5 — Expansión

- [ ] Soporte eventos corporativos (no solo bodas)
- [ ] Módulo de marca personal + contenido UGC
- [ ] Directorio público de planners
- [ ] Marketplace de proveedores cross-planner

---

*Documento generado en sesión de planeación — Abril 2026*

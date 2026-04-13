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

## Fase 2 — MVP Web

**Objetivo:** Conectar el prototipo con un backend real y desplegarlo en producción.  
**Resultado:** Producto funcional que un planner real puede usar para gestionar sus bodas.

---

### Paso 1 — Setup del backend Rust

- [ ] Inicializar proyecto Rust con Axum y Tokio
- [ ] Configurar estructura de carpetas (handlers, models, services, middleware, config)
- [ ] Setup de variables de entorno con `dotenv`
- [ ] Configurar CORS para comunicación con el frontend Next.js
- [ ] Dockerfile optimizado para Fly.io
- [ ] CI/CD básico con GitHub Actions (build + test en cada push)
- [ ] Health check endpoint

---

### Paso 2 — Base de datos

- [ ] Diseño del esquema completo en PostgreSQL
  - Tablas: planners, team_members, clients, events, vendors, vendor_categories, contracts, budget_items, payments, tasks, odp, assets, notifications
- [ ] Configurar SQLx con sistema de migraciones
- [ ] Conectar a Supabase (PostgreSQL gestionado)
- [ ] Seeds de datos para desarrollo
- [ ] Índices para queries frecuentes

---

### Paso 3 — Autenticación multi-tenant

- [ ] Integrar Clerk en frontend Next.js
- [ ] Middleware en Axum para validar JWTs de Clerk
- [ ] Definir roles: `planner`, `team_member`, `vendor`, `client`
- [ ] Row Level Security en PostgreSQL por planner (aislamiento total de datos)
- [ ] Flujo de onboarding para nuevo planner
- [ ] Invitación de equipo por email
- [ ] Invitación de proveedor y cliente por email

---

### Paso 4 — CRM funcional

- [ ] API REST: CRUD completo de clientes
- [ ] API REST: CRUD completo de eventos
- [ ] Búsqueda y filtros reales en base de datos
- [ ] Conectar frontend CRM con API
- [ ] Validaciones de formularios con Zod
- [ ] Paginación en listas

---

### Paso 5 — Presupuesto funcional

- [ ] API REST: CRUD de categorías y líneas de presupuesto
- [ ] Cálculos de totales en el backend
- [ ] Persistencia de ediciones en tiempo real (debounce + autosave)
- [ ] Exportación real a Excel con SheetJS en el frontend
- [ ] Historial de cambios del presupuesto

---

### Paso 6 — Timeline funcional

- [ ] API REST: CRUD de tareas con fechas y asignaciones
- [ ] Drag & drop que persiste en el backend
- [ ] Cálculo automático de fechas hacia atrás desde el evento
- [ ] Primeros jobs automáticos con apalis: recordatorio de tarea próxima a vencer

---

### Paso 7 — Módulo de proveedores funcional

- [ ] API REST: CRUD de proveedores y catálogo
- [ ] Asignación de proveedores a eventos
- [ ] CRUD de ODPs
- [ ] Portal del proveedor con autenticación real via Clerk
- [ ] Notificación al proveedor cuando recibe una ODP

---

### Paso 8 — Contratos funcionales

- [ ] Templates de contrato con auto-completado real de datos del evento
- [ ] Generación de PDF real con React PDF
- [ ] Envío de contrato por email con Resend
- [ ] Almacenamiento del PDF firmado en Cloudflare R2
- [ ] Estado del contrato actualizado tras firma

---

### Paso 9 — Portal del cliente funcional

- [ ] Portal del cliente con autenticación real via Clerk (invite por email)
- [ ] Progreso del evento en tiempo real con WebSockets (Axum + tokio-tungstenite)
- [ ] Vista controlada: sin datos sensibles del presupuesto interno
- [ ] Sección de aprobaciones con respuesta del cliente guardada en DB

---

### Paso 10 — Automatizaciones base

- [ ] Configurar apalis con backend en PostgreSQL
- [ ] Job: recordatorio de pago próximo (email + notificación en app)
- [ ] Job: alerta cuando una tarea está atrasada
- [ ] Job: email de bienvenida al cliente al crear su evento
- [ ] Job: resumen semanal al planner con estado de todos sus eventos
- [ ] Dashboard de jobs en panel de administración

---

### Paso 11 — Integración Canva Connect

- [ ] Solicitar acceso al programa de partners de Canva
- [ ] Implementar OAuth flow de Canva en el backend Rust
- [ ] Embeber editor de Canva en el módulo de diseño del evento
- [ ] Guardar referencia de assets de Canva vinculados al evento en PostgreSQL
- [ ] Mostrar thumbnail de diseños de Canva en el presupuesto como referencia visual

---

### Paso 12 — Deploy y estabilización

- [ ] Deploy del frontend en Vercel con dominio personalizado
- [ ] Deploy del backend Rust en Fly.io
- [ ] Variables de entorno de producción configuradas
- [ ] Monitoreo básico con logs en Fly.io
- [ ] Configurar backups automáticos en Supabase
- [ ] Pruebas end-to-end antes de abrir a primeros usuarios
- [ ] Onboarding del primer planner real en producción

---

## Fases futuras

| Fase | Descripción |
|---|---|
| **Fase 3 — Producto completo web** | Automatizaciones avanzadas, módulo de proveedores completo, WhatsApp Business API, pasarelas de pago locales LATAM, templates avanzados de contrato |
| **Fase 4 — Aplicación de escritorio** | Empaquetado con Tauri (Rust). Mismo frontend React, lógica Rust compartida. Funcionalidad offline básica. Distribución macOS, Windows, Linux |
| **Fase 5 — Expansión** | Soporte para eventos corporativos, internacionalización a otros mercados LATAM, módulo de marca personal y contenido UGC, directorio público de planners |

---

*Documento generado en sesión de planeación — Abril 2026*

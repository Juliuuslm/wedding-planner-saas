# Proyecto: Plataforma SaaS para Wedding Planners y Proveedores

> Versión del documento: 1.0 — Abril 2026  
> Estado: Fase de planeación / Pre-desarrollo

---

## Tabla de contenidos

1. [Visión general del proyecto](#1-visión-general-del-proyecto)
2. [Problema que resuelve](#2-problema-que-resuelve)
3. [Usuarios objetivo](#3-usuarios-objetivo)
4. [Tech Stack](#4-tech-stack)
5. [Decisiones de integración](#5-decisiones-de-integración)
6. [Features requeridas (base competitiva)](#6-features-requeridas-base-competitiva)
7. [Diferenciadores únicos](#7-diferenciadores-únicos)
8. [Análisis de competencia](#8-análisis-de-competencia)
9. [Hoja de ruta general](#9-hoja-de-ruta-general)

---

## 1. Visión general del proyecto

Una plataforma SaaS web (con futura expansión a aplicación de escritorio vía Tauri/Rust) diseñada específicamente para **wedding planners profesionales y sus proveedores**, orientada al mercado latinoamericano de habla hispana.

El producto centraliza en una sola plataforma todo lo que hoy los planners manejan con 5 a 7 herramientas separadas: gestión de clientes, presupuesto, diseño visual, contratos, hoja de ruta, catálogo de proveedores, automatizaciones y portal del cliente. La visión a largo plazo incluye expansión hacia **eventos corporativos** y consolidarse como la herramienta de gestión integral para el mercado de eventos en Latinoamérica.

---

## 2. Problema que resuelve

Los wedding planners profesionales actualmente operan con herramientas desconectadas entre sí (Notion, Canva, Google Sheets, WhatsApp, Wix, herramientas de contabilidad), lo que genera:

- Discrepancias entre presupuesto visual (Canva) y presupuesto real (Excel/Sheets) porque no están conectados.
- Duplicación de datos al registrar la misma información en múltiples plataformas.
- Errores operacionales por falta de sincronización entre herramientas.
- Tiempo perdido en tareas manuales repetitivas que podrían automatizarse.
- Falta de una vista única del progreso de cada evento para el cliente.
- Gestión de proveedores dispersa, sin trazabilidad de contratos, pagos y órdenes de desempeño.
- Ausencia de herramientas en español adaptadas al contexto latinoamericano.

---

## 3. Usuarios objetivo

**Usuario primario — Wedding Planner profesional:**
Coordina múltiples bodas simultáneamente, maneja un equipo, gestiona relaciones con proveedores fijos y ocasionales, presenta presupuestos y contratos a clientes, y necesita visibilidad total del estado de cada evento.

**Usuario secundario — Proveedor:**
Floristas, fotógrafos, catering, iluminación, música, decoración y demás proveedores que trabajan de forma recurrente con planners. Necesitan un espacio para recibir órdenes de desempeño (ODP), confirmar disponibilidad, compartir cotizaciones y coordinar pagos.

**Usuario terciario — Cliente (novios/familia):**
Acceso limitado y controlado a un portal donde pueden ver el progreso de su evento, aprobar decisiones de diseño, revisar el estado de pagos y comunicarse con el planner. No tienen acceso a información operacional completa.

---

## 4. Tech Stack

### Frontend Web y Desktop
| Tecnología | Uso |
|---|---|
| **Next.js 14+ (App Router)** | Framework principal, SSR para páginas de marketing, routing |
| **React 18** | UI components |
| **TypeScript** | Tipado estático end-to-end en el frontend |
| **Tailwind CSS** | Estilos utilitarios |
| **Shadcn/ui** | Librería de componentes de producción, 100% customizable |
| **TanStack Table** | Módulo de presupuesto estilo spreadsheet |
| **FullCalendar** | Timeline / hoja de ruta con vista Gantt (licencia commercial ~$799/año) |
| **DnD Kit** | Drag & drop para timeline y boards de tareas |
| **React PDF** | Generación de contratos en PDF desde el navegador |
| **SheetJS** | Exportación de presupuestos a Excel desde el frontend |

### Backend API
| Tecnología | Uso |
|---|---|
| **Next.js Route Handlers** | API REST interno en `src/app/api/**/route.ts`. Mismo proceso que el frontend, cero latencia de red interna. |
| **Zod** | Validación de input en endpoints y formularios |

### Base de datos
| Tecnología | Uso |
|---|---|
| **PostgreSQL 16** | Base de datos relacional principal |
| **Prisma 7** | ORM type-safe con migraciones declarativas y cliente generado (`@prisma/client`). Usa `@prisma/adapter-pg` para conectar. |
| **Neon / Supabase** | PostgreSQL gestionado en producción (Neon recomendado por su pooler serverless). |
| **Row Level Security (RLS)** | Aislamiento multitenant en la base de datos. Cada request setea `SET LOCAL app.current_planner` dentro de una transacción; las policies filtran rows por tenant. Defensa en profundidad con `where: { plannerId }` en Prisma. |

### Automatizaciones y Jobs
| Tecnología | Uso |
|---|---|
| **Inngest / pg-boss** *(post-MVP)* | Cola de trabajos. Inngest (SaaS, free tier generoso) o pg-boss (self-hosted sobre Postgres). Se agrega en Fase 3. |

### Autenticación y Acceso
| Tecnología | Uso |
|---|---|
| **Auth.js v5 (NextAuth)** | Auth propia, self-hosted, gratis. Providers: Credentials (bcrypt) y Resend (magic-link por email). Session JWT firmada en servidor, incluye `role` y `scopeId` para portales cliente/proveedor. |
| **@auth/prisma-adapter** | Persistencia de sesiones y cuentas en Postgres. |

### Almacenamiento y Comunicaciones
| Tecnología | Uso |
|---|---|
| **Cloudflare R2** | Almacenamiento de archivos (contratos, fotos, documentos) — compatible con SDK S3 de Rust |
| **Resend** | Emails transaccionales (notificaciones, contratos, recordatorios) |
| **React Email** | Templates de email diseñados en React |

### Integraciones externas
| Tecnología | Uso |
|---|---|
| **Canva Connect API** | Editor de Canva embebido dentro de la plataforma |

### Infraestructura y Despliegue
| Tecnología | Uso |
|---|---|
| **Vercel** | Hosting de la app completa (frontend + Route Handlers) con deploys automáticos en cada push |
| **Neon / Supabase** | Postgres gestionado. Un único servicio en Railway alternativa si se prefiere self-host. |

### Fase 4 — Aplicación de escritorio
| Tecnología | Uso |
|---|---|
| **Tauri (Rust)** | Wrapper desktop nativo que embebe el mismo frontend React. El shell Rust (`src-tauri/`) es independiente del API (que sigue siendo Next.js). La app de escritorio consume el API por HTTP igual que el web. |

---

### Justificación de decisiones clave del stack

**¿Por qué Next.js full-stack y no un backend separado?**
El MVP no tiene escala que justifique duplicar lenguajes. Con Route Handlers el mismo repo maneja UI y API: un solo deploy, un solo runtime, tipos compartidos vía Prisma. La decisión previa de usar Rust+Axum se revirtió porque: (a) Tauri no requiere backend Rust — el shell nativo es independiente del API server, (b) el ecosistema wedding (Stripe LATAM, Resend, React PDF, webhooks) está más maduro en Node/TS, (c) iterar en dos stacks ralentiza el descubrimiento de producto.

**¿Por qué Prisma y no una librería más baja?**
Prisma genera un cliente type-safe desde el schema. Los tipos del dominio fluyen al frontend sin duplicación. Las migraciones son declarativas y reproducibles. Prisma 7 usa driver adapters (`@prisma/adapter-pg`), lo que permite usar connection poolers como el de Neon de forma directa.

**¿Por qué Auth.js y no Clerk?**
Clerk cobra por MAU. Auth.js v5 es gratis, self-hosted, extensible y cubre los mismos casos: credentials, magic-link, OAuth social. La sesión JWT se firma en servidor y lleva `role` + `scopeId` para los portales cliente/proveedor.

**¿Por qué RLS en Postgres y no solo filtros app-side?**
RLS proporciona una red de seguridad a nivel base de datos: si un bug en código app olvida filtrar por tenant, la DB rechaza la query. No es sustituto del filtro app-side sino complemento. El patrón `SET LOCAL app.current_planner` dentro de transacciones evita estado compartido entre requests.

---

### Puntos fuertes del stack

- Un solo lenguaje (TS) entre UI y API: tipos compartidos, menos context-switching.
- Prisma genera tipos del schema → sin duplicar entre DB y frontend.
- RLS en Postgres como defensa en profundidad para multitenancy.
- Un solo deploy en Vercel simplifica CI/CD y observabilidad.
- Ecosistema Node maduro para integraciones del dominio (Resend, Stripe, WhatsApp API, PDF).

### Debilidades y riesgos del stack

- Prisma 7 es reciente; algunos patrones aún evolucionan (driver adapters, config file).
- Auth.js v5 está en beta (v5.0.0-beta.31 al momento de migración); puede requerir revisitar API.
- RLS añade complejidad operativa: los tests de aislamiento deben correr con rol `app_user` (sin BYPASSRLS).
- FullCalendar requiere licencia commercial para SaaS (~$799/año).
- Canva Connect requiere aprobación de partner de Canva para producción (proceso de semanas).

---

## 5. Decisiones de integración

### Canva → Integrar via API ✅
Canva es una herramienta de diseño que es imposible de replicar en tiempo y presupuesto razonables. La API de Canva Connect permite embeber el editor completo dentro de la plataforma. El usuario diseña sin salir de la app, y los assets quedan vinculados a los datos del evento. Esto resuelve el problema de desconexión entre diseño y presupuesto.

### Notion → Construir funcionalidad similar de forma nativa ✅
Integrar con Notion implicaría que los datos del cliente viven fuera de la plataforma, con dependencia en la API de Notion y sus rate limits. En cambio, se construyen módulos propios inspirados en la UX de Notion: base de datos de clientes, bitácora de progreso, vistas de tabla con filtros y campos personalizados. Los datos son 100% propiedad de la plataforma.

### Excel / Google Sheets → Construir nativo + exportar ✅
El presupuesto vive dentro de la plataforma (módulo nativo con TanStack Table). Se ofrece exportación a Excel y Google Sheets con un clic via SheetJS. El presupuesto nativo es la fuente de verdad, y al estar en la misma plataforma que el diseño en Canva, la desconexión que existía entre ambas herramientas queda resuelta.

---

## 6. Features requeridas (base competitiva)

Estas son las features que todos los competidores ya tienen y que son el mínimo para ser tomado en serio en el mercado:

### Gestión de clientes (CRM)
- Cartera de clientes con datos completos
- Agenda de bodas y calendario de eventos
- Historial de eventos por cliente
- Comunicación centralizada (email + WhatsApp)
- Gestión de pagos, calendario de pagos y recibos digitales

### Contratos y documentos legales
- Templates de contrato con autocompletado (nombre, paquete, costos)
- Firma digital integrada
- Almacenamiento seguro de documentos

### Hoja de ruta / Timeline
- Planificación hacia adelante y hacia atrás (backwards/forwards)
- Vista Gantt
- Asignación de responsables por tarea
- Alertas y recordatorios automáticos
- Este módulo es el más complejo y el más valorado por el mercado

### Presupuesto y finanzas
- Presupuesto detallado con líneas de ítem
- Tracking de pagos y saldos
- Referencia visual conectada (via Canva embed)
- Exportación a Excel
- Sin discrepancias entre diseño y números

### Paquetes de bodas
- Gestión de paquetes personalizables
- Configuración por tipo de evento y presupuesto
- Propuestas generadas automáticamente desde los paquetes

### Diseño de eventos
- Editor Canva embebido dentro de la plataforma
- Mockups y referencias visuales vinculadas al evento
- Opción de impresión integrada

### Portal del cliente
- Vista controlada del progreso del evento
- Sin acceso a información operacional completa
- Aprobación de decisiones de diseño
- Estado de pagos visible
- Comunicación directa con el planner

### Catálogo de proveedores
- Organizado por categorías (florería, fotografía, catering, música, etc.)
- Precios y disponibilidad
- Historial de trabajo con cada proveedor
- Coordinación de colores y detalles específicos

### Gestión de proveedores (B2B)
- Módulo dedicado para la relación planner-proveedor (diferenciador clave)
- Órdenes de Desempeño (ODP) por proveedor y evento
- Portal del proveedor: recibe ODP, confirma, cotiza
- Contratos con proveedores
- Tracking de pagos a proveedores

### Automatizaciones
- Workflows automáticos por fecha, acción o estado
- Recordatorios de pago automáticos
- Generación automática de contratos desde templates
- Notificaciones por email y WhatsApp
- Objetivo: minimizar tareas manuales repetitivas

### Gestión operacional
- Escalabilidad de equipo (1 persona extra por cada 50 invitados)
- Asignación de tareas por miembro del equipo
- Control post-evento (inventario de material)
- Bitácora de progreso con historial completo

---

## 7. Diferenciadores únicos

Estas son las features que nos distinguen de todos los competidores actuales:

**Módulo de proveedores como ciudadanos de primera clase.**
Ningún competidor tiene un módulo B2B planner-proveedor tan desarrollado. Rock Paper Coin se acerca, pero está orientado al mercado anglosajón. Este módulo es una ventaja competitiva real en LATAM donde las redes de proveedores son relacionales y requieren coordinación intensiva.

**Diseño visual conectado al presupuesto.**
Al tener Canva embebido y el presupuesto nativo en la misma plataforma, los números y el diseño visual siempre están sincronizados. Este era el principal punto de dolor identificado en el research con el cliente.

**Plataforma en español para el mercado latinoamericano.**
Solo That's The One (TTO) tiene soporte en español entre los competidores relevantes. Ninguno está construido pensando en el contexto LATAM (monedas locales, flujos de trabajo locales, relación con proveedores).

**Continuidad web → desktop.**
El mismo producto, misma experiencia, mismos datos, disponible como app de escritorio con Tauri en la fase 2. Ningún competidor actual ofrece esto.

**Expansión a eventos corporativos.**
Diseñado desde la arquitectura para soportar tipos de evento más allá de bodas: bautizos, quinceañeras, eventos corporativos, conferencias. La plataforma es el sistema de gestión de eventos del planner, no solo de bodas.

---

## 8. Análisis de competencia

### Competidores directos (planners profesionales)

**Aisle Planner** — Referente del mercado para planners profesionales. Timeline, mood boards, portal de cliente, presupuesto detallado. $240-600/año. Sin integración con Canva o Notion. Solo en inglés.

**HoneyBook** — Fuerte en CRM, automatización y propuestas. En 2026 agregó generación de propuestas con IA. $36-129/mes. Orientado a EEUU. Subió precios 89% en 2026.

**Dubsado** — El mejor en automatización granular de workflows. Plan gratis hasta 3 clientes. $16-55/mes. Dubsado 3.0 relanzado en noviembre 2025. Solo en inglés.

**Planning Pod** — 20+ herramientas integradas (CRM, BEO, contratos, pagos). Se integra con QuickBooks, Slack, Google Drive. $49-119/mes. Solo en inglés.

**That's The One (TTO)** — Más relevante para LATAM: soporta español, portugués y 5 idiomas más, y 20+ monedas. $55-60/mes para planners. Fuerte en colaboración en tiempo real.

**Plutio** — El más económico ($19/mes). CRM, Gantt, contratos, portal de cliente. Sin restricción de features por tier.

### Competidores B2B (relación planner-proveedor)

**Rock Paper Coin** — Plataforma de tres vías: planner, proveedor, cliente. Aprobación de contratos de proveedores, gestión de pagos en nombre del cliente. Sin versión en español.

**BriteBiz** — El más robusto para venues y proveedores. Integra con The Knot y WeddingWire. £199/mes (~$250 USD). Solo en inglés, mercado europeo principalmente.

### Gap de mercado identificado

No existe ninguna plataforma dedicada al mercado latinoamericano que conecte planners con sus proveedores en español, con presupuesto integrado visualmente a herramientas de diseño, con módulo de proveedor como parte central del producto, y con roadmap hacia aplicación de escritorio.

---

## 9. Hoja de ruta general

> El roadmap detallado con pasos específicos, tecnologías por fase y criterios de completitud se define en el siguiente paso del proceso.

**Fase 1 — Prototipo visual**
Diseño y validación de la UX/UI antes de escribir código de producción. Wireframes, flujos de usuario, diseño de componentes clave. Objetivo: validar la propuesta con usuarios reales (planners y proveedores).

**Fase 2 — MVP Web (SaaS)**
Implementación del producto mínimo viable con las features core: CRM, hoja de ruta, presupuesto nativo, contratos, portal del cliente y módulo básico de proveedores. Backend Rust + Axum, frontend Next.js, deploy en Vercel + Fly.io.

**Fase 3 — Producto completo Web**
Automatizaciones, módulo Canva embebido, módulo de proveedores completo con portal, gestión de equipo, notificaciones en tiempo real, exportaciones, templates avanzados.

**Fase 4 — Aplicación de escritorio**
Empaquetado con Tauri (Rust). Mismo frontend React, misma lógica de negocio Rust compartida. Funcionalidad offline básica. Distribución para macOS, Windows y Linux.

**Fase 5 — Expansión**
Soporte para eventos corporativos, internacionalización a otros mercados de LATAM, integraciones adicionales (WhatsApp Business API, pasarelas de pago locales), módulo de marca personal y contenido UGC.

---

*Documento generado en sesión de planeación — Abril 2026*

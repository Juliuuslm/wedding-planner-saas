# Análisis competitivo + Plan de mejoras UX/producto

> Research + roadmap estratégico. Sin modificaciones al código. Fuente para decidir siguientes fases de producto.

---

## 1. Contexto

Tras pivotar a arquitectura event-first y construir catálogo de servicios con import CSV, el MVP cubre los fundamentos operativos. Antes de seguir añadiendo features en la dirección más obvia (más tabs, más filtros, más campos), este documento audita qué hace la competencia bien y mal, qué patrones de UX de SaaS modernas aplican a wedding planning, y dónde está el **wedge** defendible para una plataforma LATAM-native.

El objetivo no es copiar features. Es identificar la **intersección** entre:
1. Lo que los planners ya pagan por hacer bien (validado por revenue de HoneyBook/Dubsado).
2. Lo que la competencia hace mal o no hace.
3. Lo que el stack actual (Next + Prisma + RLS + shadcn) puede ejecutar en 2–4 semanas por fase.

---

## 2. Panorama competitivo

### 2.1 US premium — HoneyBook, Aisle Planner, Dubsado, Planning Pod

| Plataforma | Fortalezas | Debilidades | Pricing 2026 |
|---|---|---|---|
| **HoneyBook** | Onboarding suave, IA redacta emails (plan Essentials+), marca personalizable, automatizaciones "Approval required", propuestas públicas sin login | 51–89% aumento de precio feb 2025 (Starter $19 → $36, Essentials $39 → $59). No es wedding-specific: falta RSVP, seating, meal preferences. Portal cliente molesto para couples. 3.5/5 en Trustpilot (571 reseñas), queja dominante = pricing | $36–$79 USD/mes |
| **Aisle Planner** | Wedding-specific real, timeline + design studio + mood boards, mejor para multi-evento. Dominante en full-service | Sin automation seria. Los couples no usan el portal — "prefieren Google Drive". Sin integración CRM/contabilidad. Soporte email-only US timezone | $49.99+ USD/mes por proyectos activos |
| **Dubsado** | Flexibilidad total, workflows condicionales, multi-currency decente. En encuesta 400+ fotógrafos: 38% prefieren Dubsado vs 19% HoneyBook | Dubsado 3.0 (nov 2025) quitó conditional logic — queja masiva. Curva de aprendizaje alta. UI english-only | $35 USD/mes |
| **Planning Pod** | 20+ tools en uno, dashboard at-a-glance de overdue/waiting/upcoming, RSVP + seating nativos | Email editor "parece barato", emails caen en spam / marcados scam. Pricing confuso entre 3 productos. Linking entre mensajes/pagos falla (cross-account bleed) | $59+ USD/mes |

**Tema común:** ninguno es Spanish-first, ninguno integra WhatsApp, ninguno factura en MXN/COP/ARS native, todos arriba de $30 USD/mes.

### 2.2 Global/"premium pero asequible" — That's The One (TTO)

- Spanish + 6 idiomas, 17–20 monedas (incluye MXN, COP, ARS).
- $55–60 USD/mes plano, eventos ilimitados.
- **Queda corto en:** sin WhatsApp, payment rails US-centric, pricing en USD (vulnerable a TC), sin templates de contratos LATAM, sin consideraciones fiscales SAT/DIAN/AFIP.

### 2.3 LATAM/España — Wedify, The White Planner, 360 Event, WeddingPlan

- **Wedify (ES, Valencia):** B2B para planners, venues, catering. Escandallo automático. ~€12–€78/mes. Pero: estructura pensada para fincas españolas, no para planner-orquestador LATAM. Sin WhatsApp. EUR.
- **The White Planner (ES):** Dashboard + agenda + directorio + control gasto vs presupuesto. Spain-focused, pequeña.
- **360 Event Software (ES):** ERP+CRM para planners/venues. Sabor ERP pesado. EUR.
- **WeddingPlan (FR/ES):** Multi-rol (organizador/pareja/invitado/proveedor). Moodboards. Francés-nativo, LATAM débil. EUR.

### 2.4 El marketplace que NO es tool — Bodas.com.mx / Zankyou

- The Knot Worldwide (Bodas.com.mx, Matrimonio.com.co, Casamientos.com.ar, Bodas.net) y Zankyou son **couple-facing**. Planners pagan para aparecer en directorio, reciben leads. Cero workflow post-lead.
- Tras ganar el lead, 100% del trabajo se va a Excel/Notion/WhatsApp. **Gap enorme.**

### 2.5 El competidor real — Notion / Airtable / Excel

- Lo que los planners LATAM usan de facto: Notion/Excel para plan + Drive para archivos + WhatsApp para comms + Word/PDF para contratos + Canva para moodboards.
- Marketplace lleno de "Plantillas Wedding Planner" en español (€15–€40 en Gumroad/Notion templates).
- Es gratis-ish, en español, funciona en el teléfono, pero no integra nada y cada planner reinventa la rueda.

---

## 3. El wedge — qué NADIE combina

Después de 10 competidores revisados, **nadie** ofrece las tres cosas siguientes juntas:

1. **Spanish-first admin + cliente + proveedor** (no capa de traducción).
2. **WhatsApp como canal comms first-class** (templates, grupos por evento, aprobaciones desde WA).
3. **Facturación nativa MXN/COP/ARS** (Stripe LATAM / Conekta / Mercado Pago), con USD opcional para destination.

Agregando patas complementarias:
4. Templates contratos LATAM + e-sign local (Mifiel MX, Firmamex, etc.).
5. Pricing en moneda local (~MXN 499–999/mes solo, MXN 1,999+ estudios).
6. Mobile-first para coordinación día-del-evento.
7. Multi-currency por evento (destino: USD couple → MXN vendors).

TTO cubre 1 + 5 parcial. Wedify cubre 1 pero es España/EUR/venue-style. Aisle/HoneyBook/Dubsado cubren 0.

**Este es el wedge defendible.**

---

## 4. Patrones UX para robar (priorizados por ROI)

### Tier 1 — Alto impacto, bajo costo (2–4 días cada uno)

**a) Cmd+K / command palette global (Linear, Notion, Raycast)**
- *Por qué funciona:* usuarios expertos nunca usan menús; novatos descubren features tecleando intención.
- *Aplica:* wedding planners juggle 5–15 eventos simultáneos. Cambio de contexto rápido = killer feature. Comandos: "Nuevo evento", "Ir a cliente X", "Agregar tarea a boda Morales", "Cambiar estado a firmado".
- *Stack:* `cmdk` ya instalado. Falta wrapper global + keyboard listener + registry de commands.

**b) Lifecycle bar persistente en header del evento (HubSpot)**
- *Por qué funciona:* el planner orienta su cerebro en un vistazo entre 15 eventos.
- *Aplica:* header de `/eventos/[id]` con barra `[Lead] → [Cotizado] → [Firmado] → [Planeando] → [30 días] → [Semana] → [Día D] → [Cerrado]`. Estado actual destacado.

**c) "Visible para cliente" toggle por objeto (Basecamp)**
- *Por qué funciona:* elimina el miedo #1 de correr un portal cliente — filtrar por accidente precios internos, markups, notas sucias.
- *Aplica:* cada nota, archivo, tarea, línea presupuesto tiene pill "Visible para cliente". Default oculto. Un toggle visible = cero ansiedad.

**d) Skeleton loaders que coincidan con el layout final**
- *Por qué funciona:* CLS cero, feel premium.
- *Aplica:* ya hay loading.tsx en dashboard routes. Faltan tabs del evento (General/Presupuesto/Timeline al cambiar tab → skeleton especifico de ese tab).

### Tier 2 — Alto impacto, costo medio (1–2 semanas cada uno)

**e) Inline editing + autosave (Airtable, Linear)**
- *Por qué funciona:* sin ceremonia "edit → save". Click, teclea, tab, listo.
- *Aplica:* tabla presupuesto, catálogo servicios, guest list. Doble-click celda → input. Autosave con debounce 500ms + indicador "guardando".

**f) Evento como URL-first (Linear)**
- *Por qué funciona:* cada tab del evento tiene deep link shareable con asistentes.
- *Aplica:* `/eventos/morales-2026/presupuesto`, `/eventos/morales-2026/timeline` (slug estable, no UUID). Compartir con segundo coordinador = pegar link.

**g) BEO / "Hoja del día" (Tripleseat)**
- *Por qué funciona:* UN artefacto que consolida todo lo del día del evento. Chefs, meseros, coordinadores trabajan del mismo PDF.
- *Aplica:* generar hoja del día / URL shareable con timeline + vendors + contactos + dietary + pagos. **Este es el deliverable por el que los planners pagan solos.**

**h) Design-first event page = preview del portal (Splash)**
- *Por qué funciona:* mientras editas ves lo que el couple verá. Data entry → "construir algo".
- *Aplica:* tab "Portal" del evento muestra preview del `/portal-cliente/[id]` junto con panel de edición.

### Tier 3 — Alto impacto, costo alto (2–4 semanas cada uno)

**i) Pipeline kanban drag-between-stages (Pipedrive)**
- *Por qué funciona:* mover deal físicamente refleja modelo mental. Cambio de stage dispara automations invisibles.
- *Aplica:* vista "Pipeline" de eventos: columnas por estado. Drag `boda-x` de "Lead" a "Planificación" → dispara: crear timeline base, enviar welcome email al portal, programar reunión 30 días.

**j) Workflow automations visuales (Dubsado)**
- *Por qué funciona:* "cuando X → Y + Z" como cadenas visuales if/then. Planners dejan de olvidar pasos.
- *Aplica:* no builder blank-canvas — ship 3–5 workflows pre-built que el 80% quiere:
  1. "Cuando firma contrato → crear timeline base + enviar bienvenida portal + programar reunión 30 días"
  2. "Cuando falta 30 días → recordatorio confirmar vendors"
  3. "Cuando falta 7 días → enviar hoja del día al equipo"
  4. "Cuando paga anticipo → enviar recibo + activar portal diseños"
  5. "Cuando completa evento → enviar encuesta + solicitar review"

**k) WhatsApp integration (Cloud API)**
- *Por qué funciona:* canal #1 en LATAM. Sin esto compites contra gratis (WhatsApp + Excel).
- *Aplica:*
  - Templates de mensajes aprobados por Meta (recordatorio pago, confirmación reunión, aprobación diseño).
  - Grupo de WhatsApp automático por evento (planner + couple + proveedores clave).
  - Links de portal desde WA — 1 tap y el couple aprueba un diseño.
  - Log de conversaciones dentro del evento (no replace WA, pero contexto).

**l) Contract signing + invoice + pago en un solo flujo (Moxie/Bonsai)**
- *Por qué funciona:* firmar contrato dispara primera invoice en la misma página. Cero fricción en momento de intención máxima.
- *Aplica:* página firma contrato tiene botón "Pagar anticipo" inmediato tras firma. Integra Conekta/Mercado Pago.

### Tier 4 — Diferenciadores a largo plazo

**m) Empty-state con "evento de ejemplo" poblable (Stripe Products)**
- Nuevo planner → offer "Crear evento de ejemplo" → boda ficticia completa. Explora → duplica estructura → borra ejemplo.

**n) AI drafts con user-in-the-loop (HoneyBook AI, Linear)**
- IA redacta email "Hola {couple}, te comparto el moodboard…" + botón approve/edit. Nunca "magic que pasa sola".

**o) Mobile-first day-of (CueSpot)**
- App PWA / Tauri mobile para el día del evento: timeline + check-in vendors + broadcast WhatsApp al equipo + fotos rápidas.

---

## 5. Mapeo contra el codebase actual

### Ya cubierto ✅
- Event-first IA (evento es hub, cliente es CRM histórico).
- Estado `lead` en Evento (pipeline).
- RLS multitenant, Spanish UI, MXN hardcoded.
- Portal cliente + portal proveedor.
- Catálogo de servicios por proveedor con CSV import flexible.
- Autocomplete presupuesto desde catálogo.
- Toast system, AlertDialog confirmations, loading skeletons.
- Funnel dashboard con links a eventos filtrados.

### Gap alto (must-do antes de cobrar)
1. **WhatsApp Cloud API integration** (tier 3 item k). Sin esto el producto compite contra gratis. **P1.**
2. **Pagos: Conekta / Mercado Pago integration** (tier 3 item l). Para cobrar anticipos desde el portal. **P1.**
3. **Contratos: e-sign LATAM** (Mifiel MX, Firmamex, o DocuSeal self-hosted). PDF actual insuficiente legalmente. **P1.**

### Gap medio (diferenciadores en 6 meses)
4. **Cmd+K command palette** (tier 1 item a). Feel premium inmediato, costo bajo. **P2.**
5. **Lifecycle bar en header evento** (tier 1 item b). Orientación multi-evento. **P2.**
6. **"Visible para cliente" toggle universal** (tier 1 item c). Elimina ansiedad portal. **P2.**
7. **BEO / Hoja del día** (tier 2 item g). Deliverable por el que pagan solos. **P2.**
8. **Pipeline kanban drag** (tier 3 item i). Visual de ventas. **P2.**
9. **Automations pre-built (5 workflows)** (tier 3 item j). Automatiza lo obvio, no blank canvas. **P2.**

### Gap bajo (nice-to-have 12 meses+)
10. Inline editing autosave presupuesto/catálogo.
11. Eventos con slug (`/eventos/morales-2026` en vez UUID).
12. Preview portal cliente dentro del evento.
13. AI drafts (email, descripción servicio).
14. Mobile day-of app (Tauri + PWA offline).
15. Multi-currency en un mismo evento (destination weddings).
16. Evento de ejemplo populable en onboarding.

---

## 6. Roadmap sugerido por trimestre

### Q2 2026 — "Monetizable" (6–8 semanas)
**Goal:** convertir el MVP en producto por el que un planner paga MXN 599/mes.

- [ ] **WhatsApp Cloud API**: setup Meta Business Suite, templates básicos (3), envío + log desde evento detail.
- [ ] **Pagos**: integrar Conekta o Mercado Pago. Cobro de anticipo desde portal cliente. Webhook → actualiza estado `LineaPresupuesto.montoPagado`.
- [ ] **E-sign**: integrar Mifiel MX (firma autógrafa digital NOM-151). Flujo: planner sube contrato PDF → envía a couple → firma → webhook → contrato estado `firmado`.
- [ ] **Billing propio**: Stripe LATAM para SaaS subscription MXN 599/mes. Free trial 30 días.
- [ ] **Landing + signup**: página pública `/`, signup planner con email magic-link.

**Criterios éxito:** 5 planners pagando en MXN. Tiempo promedio "lead → contrato firmado" baja de 7 días a 2.

### Q3 2026 — "Retención + feel premium" (6 semanas)
**Goal:** reducir churn con polish + diferenciadores UX.

- [ ] **Cmd+K command palette** global. Comandos: navegar, crear evento/cliente/servicio, cambiar estado.
- [ ] **Lifecycle bar persistente** en header evento.
- [ ] **Visibility toggle universal** (notas, archivos, líneas presupuesto, tareas).
- [ ] **Hoja del día** consolidada: PDF descargable + URL shareable.
- [ ] **Pipeline kanban view** en `/eventos`. Drag entre estados dispara tasks.
- [ ] **5 workflows pre-built** con toggle on/off. No builder custom.

**Criterios éxito:** churn mensual <5%. NPS ≥ 40.

### Q4 2026 — "Escalable" (8 semanas)
**Goal:** permitir que un planner con 20+ eventos paralelos crezca sin romper UX.

- [ ] Team: invitar asistentes con roles (owner/editor/viewer).
- [ ] Inline editing + autosave (presupuesto, catálogo, guest list).
- [ ] Guest list + seating charts (actualmente ausente, gap vs HoneyBook).
- [ ] Slug stable por evento (`/eventos/morales-2026`).
- [ ] Sistema de búsqueda global (Cmd+K tipo fuzzy en todo).
- [ ] AI drafts: email bienvenida portal, descripción paquete, resumen evento.

**Criterios éxito:** planners con 15+ eventos simultáneos activos. MRR duplicado vs Q2.

### 2027 — "Wedge completo"
- Mobile day-of app (Tauri).
- Multi-currency por evento (destination).
- Marketplace de templates de contrato/timeline/paquetes entre planners.
- Integración directorio Bodas.com.mx o similar (inbound lead capture).

---

## 7. Reglas de diseño para no perder el feel premium

Estas son reglas para **todas** las features nuevas. Pegar en pull requests como checklist.

**Hacer:**
- Mantener monocromo + un acento (navy + gold). Resistir añadir más colores.
- Dense-pero-airy: texto 13–14px, line-height tight, padding generoso entre bloques.
- Transiciones 150–200ms ease-out. Scale 0.98 en press, no bouncy.
- Tabular numbers en todas las tablas con dinero.
- Skeleton loaders que coincidan con layout final.
- Keyboard shortcuts visibles en menús (`⌘K`, `⇧?`).
- Micro-typography: em-dashes, quotes correctos.
- AI como "drafts que apruebas", nunca "magic que pasa sola".

**Evitar:**
- Gradientes en botones, sombras de color, glassmorphism decorativo.
- Emojis como iconos (ok en contenido del usuario, no en chrome UI).
- Ilustraciones stock de personajes cartoon diversos.
- Múltiples acentos compitiendo (badge rojo + botón azul + pill verde en la misma fila).
- Bootstrap-era rounded-2xl everywhere con drop-shadows pesados.
- "Welcome! Let's get started!" modal tours en lugar de affordances inline.
- Spinners en lugar de skeletons.
- Onboarding form-heavy antes de que el usuario vea valor.

---

## 8. Preguntas abiertas para decidir antes de Q2

1. **Pricing:** ¿MXN 599 solo / 1,999 estudio o estructura por evento activo (como Aisle)?
2. **WhatsApp:** ¿Cloud API directo (setup caro, soberanía datos) o proveedor como Twilio/MessageBird (costo por mensaje, setup bajo)?
3. **E-sign:** ¿Mifiel (NOM-151, MX-only) o DocuSeal self-hosted (multi-país, menos legal-proof)?
4. **Pagos:** ¿Conekta (MX-only, mejor tarifa) o Mercado Pago (multi-LATAM, más caro)?
5. **Free trial vs freemium:** ¿30 días trial sin tarjeta o freemium 1 evento siempre gratis?
6. **Target inicial:** ¿solo planners boutique solo-fundadoras (1–5 eventos activos) o también estudios (10+ eventos)?

Cada una ramifica el diseño — mejor decidirlas antes de construir que después.

---

## Fuentes

- [HoneyBook vs Aisle Planner 2026 — EC Marketing](https://www.eventcertificate.com/aisle-planner-vs-honeybook/)
- [Dubsado vs HoneyBook vs Aisle Planner — Boda Bliss](https://bodabliss.com/dubsado-vs-honeybook-vs-aisle-planner/)
- [Why I Chose Dubsado Over HoneyBook — KJ & Co](https://www.kjandco.ca/blog/why-i-chose-dubsado-vs-honeybook)
- [Planning Pod Reviews — Capterra](https://www.capterra.com/p/125947/Planning-Pod/)
- [Aisle Planner vs HoneyBook vs Planning Pod — Planning Pod Blog](https://planningpod.com/blog/aisle-planner-vs-honeybook-vs-planning-pod-wedding-planning-software-alternatives-reviews-pricing)
- [The Best Wedding Planning Software 2025 — That's The One](https://www.thatstheone.com/planners/blog/best-wedding-software)
- [Ultimate Guide to CRM Systems for Wedding Planners — WPIC](https://wpic.ca/business-of-weddings/the-ultimate-guide-to-crm-systems-for-wedding-planners-pros-and-cons-of-the-top-platforms/)
- [HoneyBook Review Olive Branch Events](https://olivebrancheventsco.com/dubsado-for-wedding-planners/)
- [HoneyBook vs Dubsado vs Wedy Pro — Wedy Pro AI](https://www.wedypro.ai/blog/honeybook-dubsado-wedy-pro-comparison-2026)
- [Wedify ES](https://wedify.es/)
- [The White Planner ES](https://thewhiteplanner.com/software-de-organizacion-de-bodas/)
- [360 Event Software ES](https://360eventsoftware.com/)
- [Bodas.com.mx Empresas](https://www.bodas.com.mx/emp-Acceso.php)
- [CNMC Wedding Planner adquiere Zankyou](https://www.cnmc.es/prensa/concentracion-weddingplanner-zankyou-20230111)
- [Cronoshare MX — wedding planner costos 2026](https://www.cronoshare.com.mx/cuanto-cuesta/wedding-planner)

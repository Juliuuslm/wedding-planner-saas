-- ============================================================
-- Migration: Initial Schema
-- Plataforma SaaS Wedding Planners — MVP
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Custom ENUM types
-- ============================================================

CREATE TYPE estado_cliente AS ENUM (
  'prospecto',
  'activo',
  'completado',
  'cancelado'
);

CREATE TYPE tipo_evento AS ENUM (
  'boda',
  'bautizo',
  'quinceañera',
  'corporativo',
  'otro'
);

CREATE TYPE estado_evento AS ENUM (
  'planificacion',
  'activo',
  'completado',
  'cancelado'
);

CREATE TYPE categoria_proveedor AS ENUM (
  'venue',
  'catering',
  'fotografia',
  'video',
  'musica',
  'flores',
  'decoracion',
  'pasteleria',
  'invitaciones',
  'transporte',
  'entretenimiento',
  'iluminacion',
  'mobiliario',
  'otro'
);

CREATE TYPE estado_pago AS ENUM (
  'pendiente',
  'pagado_parcial',
  'pagado'
);

CREATE TYPE estado_tarea AS ENUM (
  'pendiente',
  'en_progreso',
  'completada',
  'atrasada'
);

CREATE TYPE tipo_contrato AS ENUM (
  'cliente',
  'proveedor'
);

CREATE TYPE estado_contrato AS ENUM (
  'borrador',
  'enviado',
  'firmado',
  'cancelado'
);

CREATE TYPE estado_odp AS ENUM (
  'pendiente',
  'confirmada',
  'completada',
  'cancelada'
);

-- ============================================================
-- PLANNERS (tenant root)
-- ============================================================

CREATE TABLE planners (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id   TEXT UNIQUE NOT NULL,
  nombre          TEXT NOT NULL,
  empresa         TEXT NOT NULL,
  email           TEXT NOT NULL,
  telefono        TEXT NOT NULL DEFAULT '',
  logo            TEXT,
  moneda          TEXT NOT NULL DEFAULT 'MXN',
  zona_horaria    TEXT NOT NULL DEFAULT 'America/Mexico_City',
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CLIENTS
-- ============================================================

CREATE TABLE clients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planner_id      UUID NOT NULL REFERENCES planners(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  apellido        TEXT NOT NULL,
  email           TEXT NOT NULL,
  telefono        TEXT NOT NULL DEFAULT '',
  estado          estado_cliente NOT NULL DEFAULT 'prospecto',
  notas           TEXT,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_planner_id ON clients(planner_id);
CREATE INDEX idx_clients_estado ON clients(planner_id, estado);

-- ============================================================
-- PACKAGES
-- ============================================================

CREATE TABLE packages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planner_id      UUID NOT NULL REFERENCES planners(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  descripcion     TEXT NOT NULL DEFAULT '',
  precio          DOUBLE PRECISION NOT NULL DEFAULT 0,
  servicios       JSONB NOT NULL DEFAULT '[]'::jsonb,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_packages_planner_id ON packages(planner_id);

-- ============================================================
-- EVENTS
-- ============================================================

CREATE TABLE events (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planner_id          UUID NOT NULL REFERENCES planners(id) ON DELETE CASCADE,
  nombre              TEXT NOT NULL,
  tipo                tipo_evento NOT NULL DEFAULT 'boda',
  fecha               DATE NOT NULL,
  cliente_id          UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  venue               TEXT,
  numero_invitados    INTEGER,
  paquete_id          UUID REFERENCES packages(id) ON DELETE SET NULL,
  estado              estado_evento NOT NULL DEFAULT 'planificacion',
  presupuesto_total   DOUBLE PRECISION NOT NULL DEFAULT 0,
  progreso            DOUBLE PRECISION NOT NULL DEFAULT 0,
  notas               TEXT,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_planner_id ON events(planner_id);
CREATE INDEX idx_events_cliente_id ON events(cliente_id);
CREATE INDEX idx_events_fecha ON events(planner_id, fecha);
CREATE INDEX idx_events_estado ON events(planner_id, estado);

-- ============================================================
-- VENDORS
-- ============================================================

CREATE TABLE vendors (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planner_id      UUID NOT NULL REFERENCES planners(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  categoria       categoria_proveedor NOT NULL DEFAULT 'otro',
  contacto        TEXT,
  email           TEXT NOT NULL,
  telefono        TEXT NOT NULL DEFAULT '',
  whatsapp        TEXT,
  sitio_web       TEXT,
  descripcion     TEXT,
  servicios       JSONB DEFAULT '[]'::jsonb,
  precio_base     DOUBLE PRECISION,
  precio_min      DOUBLE PRECISION,
  precio_max      DOUBLE PRECISION,
  calificacion    DOUBLE PRECISION NOT NULL DEFAULT 0,
  foto            TEXT,
  notas           TEXT,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendors_planner_id ON vendors(planner_id);
CREATE INDEX idx_vendors_categoria ON vendors(planner_id, categoria);

-- ============================================================
-- BUDGET ITEMS (líneas de presupuesto)
-- ============================================================

CREATE TABLE budget_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planner_id      UUID NOT NULL REFERENCES planners(id) ON DELETE CASCADE,
  evento_id       UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  categoria       categoria_proveedor NOT NULL,
  concepto        TEXT NOT NULL,
  proveedor_id    UUID REFERENCES vendors(id) ON DELETE SET NULL,
  monto_estimado  DOUBLE PRECISION NOT NULL DEFAULT 0,
  monto_real      DOUBLE PRECISION,
  monto_pagado    DOUBLE PRECISION NOT NULL DEFAULT 0,
  estado          estado_pago NOT NULL DEFAULT 'pendiente',
  notas           TEXT
);

CREATE INDEX idx_budget_items_evento_id ON budget_items(evento_id);
CREATE INDEX idx_budget_items_planner_id ON budget_items(planner_id);

-- ============================================================
-- TASKS (tareas)
-- ============================================================

CREATE TABLE tasks (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planner_id          UUID NOT NULL REFERENCES planners(id) ON DELETE CASCADE,
  evento_id           UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  titulo              TEXT NOT NULL,
  descripcion         TEXT,
  responsable         TEXT,
  fecha_inicio        DATE,
  fecha_vencimiento   DATE NOT NULL,
  estado              estado_tarea NOT NULL DEFAULT 'pendiente',
  fase                TEXT NOT NULL DEFAULT '',
  orden               INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_tasks_evento_id ON tasks(evento_id);
CREATE INDEX idx_tasks_planner_id ON tasks(planner_id);
CREATE INDEX idx_tasks_estado ON tasks(evento_id, estado);

-- ============================================================
-- CONTRACTS (contratos)
-- ============================================================

CREATE TABLE contracts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planner_id      UUID NOT NULL REFERENCES planners(id) ON DELETE CASCADE,
  evento_id       UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  tipo            tipo_contrato NOT NULL,
  contraparte     TEXT NOT NULL,
  contraparte_id  UUID NOT NULL,
  estado          estado_contrato NOT NULL DEFAULT 'borrador',
  monto_total     DOUBLE PRECISION NOT NULL DEFAULT 0,
  fecha_creacion  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_envio     TIMESTAMPTZ,
  fecha_firma     TIMESTAMPTZ,
  version         INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_contracts_evento_id ON contracts(evento_id);
CREATE INDEX idx_contracts_planner_id ON contracts(planner_id);

-- ============================================================
-- ODP (Órdenes de Desempeño)
-- ============================================================

CREATE TABLE odp (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planner_id      UUID NOT NULL REFERENCES planners(id) ON DELETE CASCADE,
  evento_id       UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  proveedor_id    UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  descripcion     TEXT NOT NULL,
  monto           DOUBLE PRECISION NOT NULL DEFAULT 0,
  fecha           DATE NOT NULL,
  estado          estado_odp NOT NULL DEFAULT 'pendiente',
  requerimientos  TEXT,
  notas           TEXT
);

CREATE INDEX idx_odp_evento_id ON odp(evento_id);
CREATE INDEX idx_odp_proveedor_id ON odp(proveedor_id);
CREATE INDEX idx_odp_planner_id ON odp(planner_id);

-- ============================================================
-- EVENT_VENDORS (join table: vendor ↔ event assignment)
-- ============================================================

CREATE TABLE event_vendors (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id       UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  proveedor_id    UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  asignado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(evento_id, proveedor_id)
);

CREATE INDEX idx_event_vendors_evento ON event_vendors(evento_id);
CREATE INDEX idx_event_vendors_proveedor ON event_vendors(proveedor_id);

-- ============================================================
-- FUNCTION: auto-update actualizado_en
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with actualizado_en
CREATE TRIGGER set_actualizado_en_clients
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION trigger_set_actualizado_en();

CREATE TRIGGER set_actualizado_en_events
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION trigger_set_actualizado_en();

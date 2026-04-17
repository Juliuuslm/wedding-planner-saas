-- ============================================================================
-- Row Level Security (RLS) — multitenant isolation by planner_id
-- ============================================================================
-- Cada request autenticado setea `SET LOCAL app.current_planner = '<uuid>'`
-- y (opcionalmente para portales) `SET LOCAL app.current_scope = '<uuid>'` +
-- `SET LOCAL app.current_role = 'client'|'vendor'|'planner'`.
-- Las policies filtran rows por esas variables. Superusuario Postgres bypasea
-- RLS; la app debe usar un rol sin BYPASSRLS (app_user).
-- ============================================================================

-- ── Helpers ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION app_current_planner() RETURNS uuid AS $$
  SELECT NULLIF(current_setting('app.current_planner', true), '')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION app_current_scope() RETURNS uuid AS $$
  SELECT NULLIF(current_setting('app.current_scope', true), '')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION app_current_role() RETURNS text AS $$
  SELECT NULLIF(current_setting('app.current_role', true), '');
$$ LANGUAGE sql STABLE;

-- ── Habilitar RLS en tablas tenant-scoped ─────────────────────────────────
ALTER TABLE "planners"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clients"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "packages"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "events"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendors"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "budget_items"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tasks"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contracts"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "odp"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "event_vendors" ENABLE ROW LEVEL SECURITY;

-- ── Policies: planner ve/modifica solo su tenant ─────────────────────────
-- planners: un planner solo ve su propio row
CREATE POLICY planner_self ON "planners"
  USING (id = app_current_planner())
  WITH CHECK (id = app_current_planner());

-- Macro pattern: planner_id = app_current_planner()
CREATE POLICY tenant_iso_clients ON "clients"
  USING (planner_id = app_current_planner())
  WITH CHECK (planner_id = app_current_planner());

CREATE POLICY tenant_iso_packages ON "packages"
  USING (planner_id = app_current_planner())
  WITH CHECK (planner_id = app_current_planner());

CREATE POLICY tenant_iso_events ON "events"
  USING (planner_id = app_current_planner())
  WITH CHECK (planner_id = app_current_planner());

CREATE POLICY tenant_iso_vendors ON "vendors"
  USING (planner_id = app_current_planner())
  WITH CHECK (planner_id = app_current_planner());

CREATE POLICY tenant_iso_budget_items ON "budget_items"
  USING (planner_id = app_current_planner())
  WITH CHECK (planner_id = app_current_planner());

CREATE POLICY tenant_iso_tasks ON "tasks"
  USING (planner_id = app_current_planner())
  WITH CHECK (planner_id = app_current_planner());

CREATE POLICY tenant_iso_contracts ON "contracts"
  USING (planner_id = app_current_planner())
  WITH CHECK (planner_id = app_current_planner());

CREATE POLICY tenant_iso_odp ON "odp"
  USING (planner_id = app_current_planner())
  WITH CHECK (planner_id = app_current_planner());

-- event_vendors no tiene planner_id; derivar vía FK a events
CREATE POLICY tenant_iso_event_vendors ON "event_vendors"
  USING (EXISTS (
    SELECT 1 FROM "events" e
    WHERE e.id = event_vendors.evento_id
      AND e.planner_id = app_current_planner()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM "events" e
    WHERE e.id = event_vendors.evento_id
      AND e.planner_id = app_current_planner()
  ));

-- ── Policies adicionales para portales (cliente / proveedor) ─────────────
-- Un cliente (role='client', scope=clientId) ve solo su propio registro y
-- sus eventos relacionados. Lecturas limitadas, no modifica.
CREATE POLICY client_read_self ON "clients"
  FOR SELECT
  USING (app_current_role() = 'client' AND id = app_current_scope());

CREATE POLICY client_read_own_events ON "events"
  FOR SELECT
  USING (app_current_role() = 'client' AND cliente_id = app_current_scope());

CREATE POLICY client_read_own_contracts ON "contracts"
  FOR SELECT
  USING (
    app_current_role() = 'client'
    AND tipo = 'cliente'
    AND contraparte_id = app_current_scope()
  );

CREATE POLICY client_read_own_budget ON "budget_items"
  FOR SELECT
  USING (
    app_current_role() = 'client'
    AND EXISTS (
      SELECT 1 FROM "events" e
      WHERE e.id = budget_items.evento_id
        AND e.cliente_id = app_current_scope()
    )
  );

-- Un vendor (role='vendor', scope=vendorId) ve sus propios ODPs y su perfil
CREATE POLICY vendor_read_self ON "vendors"
  FOR SELECT
  USING (app_current_role() = 'vendor' AND id = app_current_scope());

CREATE POLICY vendor_read_own_odps ON "odp"
  FOR SELECT
  USING (app_current_role() = 'vendor' AND proveedor_id = app_current_scope());

-- Vendor puede actualizar estado de sus ODPs (pendiente → confirmada)
CREATE POLICY vendor_update_own_odps ON "odp"
  FOR UPDATE
  USING (app_current_role() = 'vendor' AND proveedor_id = app_current_scope())
  WITH CHECK (app_current_role() = 'vendor' AND proveedor_id = app_current_scope());

-- ── Rol app_user (sin BYPASSRLS) ─────────────────────────────────────────
-- Crea el rol si no existe y concede permisos necesarios.
-- La connection string de la app en producción DEBE usar este rol.
-- En dev (Docker) seguimos usando 'postgres' superuser para simplicidad,
-- pero superuser bypasea RLS por lo que los tests de aislamiento deben
-- correr con este rol.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user LOGIN PASSWORD 'app_user_local_dev';
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_user;

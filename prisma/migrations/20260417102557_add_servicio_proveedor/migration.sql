-- AlterTable
ALTER TABLE "budget_items" ADD COLUMN     "servicio_id" UUID;

-- CreateTable
CREATE TABLE "servicios_proveedor" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "planner_id" UUID NOT NULL,
    "proveedor_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "unidad" TEXT NOT NULL DEFAULT 'pieza',
    "cantidad_tipica" INTEGER,
    "categoria" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "servicios_proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "servicios_proveedor_planner_id_idx" ON "servicios_proveedor"("planner_id");

-- CreateIndex
CREATE INDEX "servicios_proveedor_proveedor_id_idx" ON "servicios_proveedor"("proveedor_id");

-- AddForeignKey
ALTER TABLE "servicios_proveedor" ADD CONSTRAINT "servicios_proveedor_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios_proveedor" ADD CONSTRAINT "servicios_proveedor_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios_proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Enable RLS for tenant isolation
ALTER TABLE "servicios_proveedor" ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy: planner can only see/modify own catalog items
CREATE POLICY "servicios_proveedor_tenant_iso" ON "servicios_proveedor"
  USING (planner_id = current_setting('app.current_planner', true)::uuid)
  WITH CHECK (planner_id = current_setting('app.current_planner', true)::uuid);

-- Grant access to app_user role
GRANT SELECT, INSERT, UPDATE, DELETE ON "servicios_proveedor" TO app_user;

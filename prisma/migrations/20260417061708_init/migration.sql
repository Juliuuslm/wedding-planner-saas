-- Enable UUID extension (for uuid_generate_v4() used as default for UUID PKs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "estado_cliente" AS ENUM ('prospecto', 'activo', 'completado', 'cancelado');

-- CreateEnum
CREATE TYPE "tipo_evento" AS ENUM ('boda', 'bautizo', 'quinceañera', 'corporativo', 'otro');

-- CreateEnum
CREATE TYPE "estado_evento" AS ENUM ('planificacion', 'activo', 'completado', 'cancelado');

-- CreateEnum
CREATE TYPE "categoria_proveedor" AS ENUM ('venue', 'catering', 'fotografia', 'video', 'musica', 'flores', 'decoracion', 'pasteleria', 'invitaciones', 'transporte', 'entretenimiento', 'iluminacion', 'mobiliario', 'otro');

-- CreateEnum
CREATE TYPE "estado_pago" AS ENUM ('pendiente', 'pagado_parcial', 'pagado');

-- CreateEnum
CREATE TYPE "estado_tarea" AS ENUM ('pendiente', 'en_progreso', 'completada', 'atrasada');

-- CreateEnum
CREATE TYPE "tipo_contrato" AS ENUM ('cliente', 'proveedor');

-- CreateEnum
CREATE TYPE "estado_contrato" AS ENUM ('borrador', 'enviado', 'firmado', 'cancelado');

-- CreateEnum
CREATE TYPE "estado_odp" AS ENUM ('pendiente', 'confirmada', 'completada', 'cancelada');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('planner', 'client', 'vendor');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "password_hash" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'planner',
    "planner_id" UUID,
    "client_id" UUID,
    "vendor_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "planners" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "auth_user_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL DEFAULT '',
    "logo" TEXT,
    "moneda" TEXT NOT NULL DEFAULT 'MXN',
    "zona_horaria" TEXT NOT NULL DEFAULT 'America/Mexico_City',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "planners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "planner_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL DEFAULT '',
    "estado" "estado_cliente" NOT NULL DEFAULT 'prospecto',
    "notas" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "planner_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL DEFAULT '',
    "precio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "servicios" JSONB NOT NULL DEFAULT '[]',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "planner_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "tipo_evento" NOT NULL DEFAULT 'boda',
    "fecha" DATE NOT NULL,
    "cliente_id" UUID NOT NULL,
    "venue" TEXT,
    "numero_invitados" INTEGER,
    "paquete_id" UUID,
    "estado" "estado_evento" NOT NULL DEFAULT 'planificacion',
    "presupuesto_total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "progreso" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notas" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "planner_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" "categoria_proveedor" NOT NULL DEFAULT 'otro',
    "contacto" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT,
    "sitio_web" TEXT,
    "descripcion" TEXT,
    "servicios" JSONB DEFAULT '[]',
    "precio_base" DOUBLE PRECISION,
    "precio_min" DOUBLE PRECISION,
    "precio_max" DOUBLE PRECISION,
    "calificacion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "foto" TEXT,
    "notas" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_items" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "planner_id" UUID NOT NULL,
    "evento_id" UUID NOT NULL,
    "categoria" "categoria_proveedor" NOT NULL,
    "concepto" TEXT NOT NULL,
    "proveedor_id" UUID,
    "monto_estimado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monto_real" DOUBLE PRECISION,
    "monto_pagado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" "estado_pago" NOT NULL DEFAULT 'pendiente',
    "notas" TEXT,

    CONSTRAINT "budget_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "planner_id" UUID NOT NULL,
    "evento_id" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "responsable" TEXT,
    "fecha_inicio" DATE,
    "fecha_vencimiento" DATE NOT NULL,
    "estado" "estado_tarea" NOT NULL DEFAULT 'pendiente',
    "fase" TEXT NOT NULL DEFAULT '',
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "planner_id" UUID NOT NULL,
    "evento_id" UUID NOT NULL,
    "tipo" "tipo_contrato" NOT NULL,
    "contraparte" TEXT NOT NULL,
    "contraparte_id" UUID NOT NULL,
    "estado" "estado_contrato" NOT NULL DEFAULT 'borrador',
    "monto_total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_envio" TIMESTAMPTZ(6),
    "fecha_firma" TIMESTAMPTZ(6),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "odp" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "planner_id" UUID NOT NULL,
    "evento_id" UUID NOT NULL,
    "proveedor_id" UUID NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fecha" DATE NOT NULL,
    "estado" "estado_odp" NOT NULL DEFAULT 'pendiente',
    "requerimientos" TEXT,
    "notas" TEXT,

    CONSTRAINT "odp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_vendors" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "evento_id" UUID NOT NULL,
    "proveedor_id" UUID NOT NULL,
    "asignado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_planner_id_idx" ON "users"("planner_id");

-- CreateIndex
CREATE INDEX "users_client_id_idx" ON "users"("client_id");

-- CreateIndex
CREATE INDEX "users_vendor_id_idx" ON "users"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "planners_auth_user_id_key" ON "planners"("auth_user_id");

-- CreateIndex
CREATE INDEX "clients_planner_id_idx" ON "clients"("planner_id");

-- CreateIndex
CREATE INDEX "clients_planner_id_estado_idx" ON "clients"("planner_id", "estado");

-- CreateIndex
CREATE INDEX "packages_planner_id_idx" ON "packages"("planner_id");

-- CreateIndex
CREATE INDEX "events_planner_id_idx" ON "events"("planner_id");

-- CreateIndex
CREATE INDEX "events_cliente_id_idx" ON "events"("cliente_id");

-- CreateIndex
CREATE INDEX "events_planner_id_fecha_idx" ON "events"("planner_id", "fecha");

-- CreateIndex
CREATE INDEX "events_planner_id_estado_idx" ON "events"("planner_id", "estado");

-- CreateIndex
CREATE INDEX "vendors_planner_id_idx" ON "vendors"("planner_id");

-- CreateIndex
CREATE INDEX "vendors_planner_id_categoria_idx" ON "vendors"("planner_id", "categoria");

-- CreateIndex
CREATE INDEX "budget_items_evento_id_idx" ON "budget_items"("evento_id");

-- CreateIndex
CREATE INDEX "budget_items_planner_id_idx" ON "budget_items"("planner_id");

-- CreateIndex
CREATE INDEX "tasks_evento_id_idx" ON "tasks"("evento_id");

-- CreateIndex
CREATE INDEX "tasks_planner_id_idx" ON "tasks"("planner_id");

-- CreateIndex
CREATE INDEX "tasks_evento_id_estado_idx" ON "tasks"("evento_id", "estado");

-- CreateIndex
CREATE INDEX "contracts_evento_id_idx" ON "contracts"("evento_id");

-- CreateIndex
CREATE INDEX "contracts_planner_id_idx" ON "contracts"("planner_id");

-- CreateIndex
CREATE INDEX "odp_evento_id_idx" ON "odp"("evento_id");

-- CreateIndex
CREATE INDEX "odp_proveedor_id_idx" ON "odp"("proveedor_id");

-- CreateIndex
CREATE INDEX "odp_planner_id_idx" ON "odp"("planner_id");

-- CreateIndex
CREATE INDEX "event_vendors_evento_id_idx" ON "event_vendors"("evento_id");

-- CreateIndex
CREATE INDEX "event_vendors_proveedor_id_idx" ON "event_vendors"("proveedor_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_vendors_evento_id_proveedor_id_key" ON "event_vendors"("evento_id", "proveedor_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_paquete_id_fkey" FOREIGN KEY ("paquete_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "odp" ADD CONSTRAINT "odp_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "odp" ADD CONSTRAINT "odp_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "odp" ADD CONSTRAINT "odp_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_vendors" ADD CONSTRAINT "event_vendors_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_vendors" ADD CONSTRAINT "event_vendors_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

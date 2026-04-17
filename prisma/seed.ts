import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import {
  mockPlanner,
  mockPaquetes,
  mockClientes,
  mockEventos,
  mockProveedores,
  mockLineasPresupuesto,
  mockTareas,
  mockContratos,
  mockODPs,
} from '../src/data/mock'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // ── Wipe (dev only). Ordered to respect FKs ─────────────────────────
  await prisma.odp.deleteMany()
  await prisma.contrato.deleteMany()
  await prisma.tarea.deleteMany()
  await prisma.lineaPresupuesto.deleteMany()
  await prisma.eventVendor.deleteMany()
  await prisma.evento.deleteMany()
  await prisma.vendor.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.paquete.deleteMany()
  await prisma.user.deleteMany()
  await prisma.planner.deleteMany()

  // ── Planner + user ─────────────────────────────────────────────────
  const planner = await prisma.planner.create({
    data: {
      nombre: mockPlanner.nombre,
      empresa: mockPlanner.empresa,
      email: mockPlanner.email,
      telefono: mockPlanner.telefono,
      moneda: mockPlanner.moneda,
      zonaHoraria: mockPlanner.zonaHoraria,
      authUserId: 'seed-' + mockPlanner.id,
    },
  })

  const passwordHash = await bcrypt.hash('password123', 10)
  await prisma.user.create({
    data: {
      email: mockPlanner.email,
      name: mockPlanner.nombre,
      passwordHash,
      role: 'planner',
      plannerId: planner.id,
    },
  })

  console.log(`Planner: ${planner.email} (password: password123)`)

  // ── Paquetes ───────────────────────────────────────────────────────
  const paqueteMap = new Map<string, string>()
  for (const p of mockPaquetes) {
    const row = await prisma.paquete.create({
      data: {
        plannerId: planner.id,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        servicios: p.servicios,
        activo: p.activo,
      },
    })
    paqueteMap.set(p.id, row.id)
  }

  // ── Clientes ───────────────────────────────────────────────────────
  const clienteMap = new Map<string, string>()
  for (const c of mockClientes) {
    const row = await prisma.cliente.create({
      data: {
        plannerId: planner.id,
        nombre: c.nombre,
        apellido: c.apellido,
        email: c.email,
        telefono: c.telefono,
        estado: c.estado,
        notas: c.notas,
      },
    })
    clienteMap.set(c.id, row.id)
  }

  // ── Proveedores ────────────────────────────────────────────────────
  const vendorMap = new Map<string, string>()
  for (const v of mockProveedores) {
    const row = await prisma.vendor.create({
      data: {
        plannerId: planner.id,
        nombre: v.nombre,
        categoria: v.categoria,
        contacto: v.contacto,
        email: v.email,
        telefono: v.telefono,
        whatsapp: v.whatsapp,
        sitioWeb: v.sitioWeb,
        descripcion: v.descripcion,
        servicios: v.servicios ?? [],
        precioBase: v.precioBase,
        precioMin: v.precioMin,
        precioMax: v.precioMax,
        calificacion: v.calificacion,
        foto: v.foto,
        notas: v.notas,
      },
    })
    vendorMap.set(v.id, row.id)
  }

  // ── Eventos ────────────────────────────────────────────────────────
  const eventoMap = new Map<string, string>()
  for (const e of mockEventos) {
    const row = await prisma.evento.create({
      data: {
        plannerId: planner.id,
        nombre: e.nombre,
        tipo: e.tipo === 'quinceañera' ? 'quinceanera' : e.tipo,
        fecha: new Date(e.fecha),
        clienteId: clienteMap.get(e.clienteId)!,
        venue: e.venue,
        numeroInvitados: e.numeroInvitados,
        paqueteId: e.paqueteId ? paqueteMap.get(e.paqueteId) : null,
        estado: e.estado,
        presupuestoTotal: e.presupuestoTotal,
        progreso: e.progreso,
        notas: e.notas,
      },
    })
    eventoMap.set(e.id, row.id)
  }

  // ── Líneas de presupuesto ──────────────────────────────────────────
  for (const l of mockLineasPresupuesto) {
    await prisma.lineaPresupuesto.create({
      data: {
        plannerId: planner.id,
        eventoId: eventoMap.get(l.eventoId)!,
        categoria: l.categoria,
        concepto: l.concepto,
        proveedorId: l.proveedorId ? vendorMap.get(l.proveedorId) : null,
        montoEstimado: l.montoEstimado,
        montoReal: l.montoReal,
        montoPagado: l.montoPagado,
        estado: l.estado,
        notas: l.notas,
      },
    })
  }

  // ── Tareas ─────────────────────────────────────────────────────────
  for (const t of mockTareas) {
    await prisma.tarea.create({
      data: {
        plannerId: planner.id,
        eventoId: eventoMap.get(t.eventoId)!,
        titulo: t.titulo,
        descripcion: t.descripcion,
        responsable: t.responsable,
        fechaInicio: t.fechaInicio ? new Date(t.fechaInicio) : null,
        fechaVencimiento: new Date(t.fechaVencimiento),
        estado: t.estado,
        fase: t.fase,
        orden: t.orden,
      },
    })
  }

  // ── Contratos ──────────────────────────────────────────────────────
  for (const c of mockContratos) {
    const contraparteUuid =
      c.tipo === 'cliente'
        ? clienteMap.get(c.contraparteId)
        : vendorMap.get(c.contraparteId)
    if (!contraparteUuid) continue

    await prisma.contrato.create({
      data: {
        plannerId: planner.id,
        eventoId: eventoMap.get(c.eventoId)!,
        tipo: c.tipo,
        contraparte: c.contraparte,
        contraparteId: contraparteUuid,
        estado: c.estado,
        montoTotal: c.montoTotal,
        fechaCreacion: new Date(c.fechaCreacion),
        fechaEnvio: c.fechaEnvio ? new Date(c.fechaEnvio) : null,
        fechaFirma: c.fechaFirma ? new Date(c.fechaFirma) : null,
        version: c.version,
      },
    })
  }

  // ── ODPs ───────────────────────────────────────────────────────────
  for (const o of mockODPs) {
    await prisma.odp.create({
      data: {
        plannerId: planner.id,
        eventoId: eventoMap.get(o.eventoId)!,
        proveedorId: vendorMap.get(o.proveedorId)!,
        descripcion: o.descripcion,
        monto: o.monto,
        fecha: new Date(o.fecha),
        estado: o.estado,
        requerimientos: o.requerimientos,
        notas: o.notas,
      },
    })
  }

  // ── Event vendors (derivadas de ODPs) ──────────────────────────────
  const pairs = new Set<string>()
  for (const o of mockODPs) {
    const eId = eventoMap.get(o.eventoId)
    const vId = vendorMap.get(o.proveedorId)
    if (!eId || !vId) continue
    const key = `${eId}:${vId}`
    if (pairs.has(key)) continue
    pairs.add(key)
    await prisma.eventVendor.create({
      data: { eventoId: eId, proveedorId: vId },
    })
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import type {
  Planner,
  Cliente,
  Evento,
  Proveedor,
  LineaPresupuesto,
  Tarea,
  Contrato,
  ODP,
  Paquete,
} from '@/types'

// ============================================================
// PLANNER
// ============================================================

export const mockPlanner: Planner = {
  id: 'planner-1',
  nombre: 'Andrea Morales',
  empresa: 'AM Wedding Studio',
  email: 'andrea@amweddingstudio.com',
  telefono: '+52 55 1234 5678',
  moneda: 'MXN',
  zonaHoraria: 'America/Mexico_City',
  creadoEn: '2024-01-15T00:00:00.000Z',
}

// ============================================================
// PAQUETES
// ============================================================

export const mockPaquetes: Paquete[] = [
  {
    id: 'paquete-1',
    nombre: 'Premium',
    descripcion: 'Coordinación completa del evento con servicio personalizado',
    precio: 85000,
    servicios: [
      'Coordinación completa',
      'Diseño de concepto',
      'Gestión de proveedores',
      'Día del evento',
      'Portal del cliente',
    ],
    activo: true,
  },
  {
    id: 'paquete-2',
    nombre: 'Esencial',
    descripcion: 'Coordinación del día del evento y gestión básica',
    precio: 45000,
    servicios: [
      'Coordinación del día',
      'Gestión de proveedores',
      'Portal del cliente',
    ],
    activo: true,
  },
]

// ============================================================
// CLIENTES
// ============================================================

export const mockClientes: Cliente[] = [
  {
    id: 'cliente-1',
    nombre: 'Valentina',
    apellido: 'García',
    email: 'valentina.garcia@email.com',
    telefono: '+52 55 9876 5432',
    estado: 'activo',
    notas: 'Prefiere comunicación por WhatsApp. Muy detallista con la decoración floral.',
    creadoEn: '2025-10-01T00:00:00.000Z',
    actualizadoEn: '2026-03-15T00:00:00.000Z',
  },
  {
    id: 'cliente-2',
    nombre: 'Carmen',
    apellido: 'Martínez',
    email: 'carmen.martinez@email.com',
    telefono: '+52 55 5555 1111',
    estado: 'activo',
    notas: 'Viaja frecuentemente. Reuniones preferentemente virtuales.',
    creadoEn: '2025-11-15T00:00:00.000Z',
    actualizadoEn: '2026-02-20T00:00:00.000Z',
  },
  {
    id: 'cliente-3',
    nombre: 'Isabella',
    apellido: 'Hernández',
    email: 'isabella.hernandez@email.com',
    telefono: '+52 55 3333 7777',
    estado: 'prospecto',
    notas: 'Interesada en paquete Premium. Presupuesto flexible. Evento en octubre.',
    creadoEn: '2026-03-01T00:00:00.000Z',
    actualizadoEn: '2026-03-01T00:00:00.000Z',
  },
]

// ============================================================
// EVENTOS
// ============================================================

export const mockEventos: Evento[] = [
  {
    id: 'evento-1',
    nombre: 'Boda García-Rodríguez',
    tipo: 'boda',
    fecha: '2026-06-15T18:00:00.000Z',
    clienteId: 'cliente-1',
    plannerId: 'planner-1',
    venue: 'Hacienda San Carlos, Cuernavaca',
    numeroInvitados: 180,
    paqueteId: 'paquete-1',
    estado: 'activo',
    presupuestoTotal: 450000,
    progreso: 65,
    notas: 'Estilo romántico campestre. Paleta: blanco, verde salvia y terracota.',
    creadoEn: '2025-10-01T00:00:00.000Z',
    actualizadoEn: '2026-04-10T00:00:00.000Z',
  },
  {
    id: 'evento-2',
    nombre: 'Boda Martínez-López',
    tipo: 'boda',
    fecha: '2026-08-22T19:00:00.000Z',
    clienteId: 'cliente-2',
    plannerId: 'planner-1',
    venue: 'Hotel Camino Real, CDMX',
    numeroInvitados: 120,
    paqueteId: 'paquete-2',
    estado: 'activo',
    presupuestoTotal: 320000,
    progreso: 40,
    notas: 'Estilo moderno y elegante. Paleta: negro, dorado y blanco.',
    creadoEn: '2025-11-15T00:00:00.000Z',
    actualizadoEn: '2026-04-05T00:00:00.000Z',
  },
  {
    id: 'evento-3',
    nombre: 'Boda Hernández-Vega',
    tipo: 'boda',
    fecha: '2026-10-10T18:30:00.000Z',
    clienteId: 'cliente-3',
    plannerId: 'planner-1',
    venue: 'Por confirmar',
    numeroInvitados: 80,
    estado: 'planificacion',
    presupuestoTotal: 200000,
    progreso: 15,
    notas: 'Ceremonia íntima. Estilo boho-chic. Venue en evaluación.',
    creadoEn: '2026-03-01T00:00:00.000Z',
    actualizadoEn: '2026-04-01T00:00:00.000Z',
  },
]

// ============================================================
// PROVEEDORES
// ============================================================

export const mockProveedores: Proveedor[] = [
  {
    id: 'proveedor-1',
    nombre: 'Flores del Valle',
    categoria: 'floreria',
    email: 'contacto@floresdelvalle.mx',
    telefono: '+52 55 2222 3333',
    precioBase: 35000,
    calificacion: 5,
    notas: 'Especialistas en flores silvestres y arreglos campestres.',
    creadoEn: '2024-06-01T00:00:00.000Z',
  },
  {
    id: 'proveedor-2',
    nombre: 'Lente & Alma Fotografía',
    categoria: 'fotografia',
    email: 'hola@lenteyalma.com',
    telefono: '+52 55 4444 5555',
    precioBase: 45000,
    calificacion: 5,
    notas: 'Incluye álbum impreso y galería digital. Estilo documental.',
    creadoEn: '2024-03-15T00:00:00.000Z',
  },
  {
    id: 'proveedor-3',
    nombre: 'Gourmet Events Catering',
    categoria: 'catering',
    email: 'eventos@gourmetevents.mx',
    telefono: '+52 55 6666 7777',
    precioBase: 850,
    calificacion: 4,
    notas: 'Precio por persona. Mínimo 80 personas. Incluye vajilla y meseros.',
    creadoEn: '2024-08-20T00:00:00.000Z',
  },
  {
    id: 'proveedor-4',
    nombre: 'Orquesta Romántica MX',
    categoria: 'musica',
    email: 'booking@orquestaromanticamx.com',
    telefono: '+52 55 8888 9999',
    precioBase: 28000,
    calificacion: 4,
    notas: '8 músicos. Repertorio clásico, jazz y boleros. 4 horas incluidas.',
    creadoEn: '2024-05-10T00:00:00.000Z',
  },
  {
    id: 'proveedor-5',
    nombre: 'Ambiance Decoraciones',
    categoria: 'decoracion',
    email: 'info@ambiancedeco.mx',
    telefono: '+52 55 1111 2222',
    precioBase: 55000,
    calificacion: 5,
    notas: 'Diseño e instalación de altar, mesas y centros. Incluye iluminación.',
    creadoEn: '2024-01-20T00:00:00.000Z',
  },
]

// ============================================================
// LÍNEAS DE PRESUPUESTO — Evento 1
// ============================================================

export const mockLineasPresupuesto: LineaPresupuesto[] = [
  // VENUE (2)
  {
    id: 'linea-1', eventoId: 'evento-1', categoria: 'venue',
    concepto: 'Renta de hacienda (12 horas)',
    montoEstimado: 120000, montoReal: 115000, montoPagado: 57500, estado: 'pagado_parcial',
  },
  {
    id: 'linea-2', eventoId: 'evento-1', categoria: 'venue',
    concepto: 'Depósito por daños (reembolsable)',
    montoEstimado: 15000, montoReal: 15000, montoPagado: 15000, estado: 'pagado',
  },
  // CATERING (3)
  {
    id: 'linea-3', eventoId: 'evento-1', categoria: 'catering',
    concepto: 'Banquete 180 personas', proveedorId: 'proveedor-3',
    montoEstimado: 153000, montoReal: 153000, montoPagado: 76500, estado: 'pagado_parcial',
  },
  {
    id: 'linea-4', eventoId: 'evento-1', categoria: 'catering',
    concepto: 'Barra de cócteles premium (5 horas)', proveedorId: 'proveedor-3',
    montoEstimado: 25000, montoPagado: 0, estado: 'pendiente',
  },
  {
    id: 'linea-5', eventoId: 'evento-1', categoria: 'catering',
    concepto: 'Pastel de bodas — 8 pisos',
    montoEstimado: 12000, montoReal: 12500, montoPagado: 12500, estado: 'pagado',
  },
  // FLORERÍA (3)
  {
    id: 'linea-6', eventoId: 'evento-1', categoria: 'floreria',
    concepto: 'Flores y arreglos completos', proveedorId: 'proveedor-1',
    montoEstimado: 38000, montoReal: 40000, montoPagado: 40000, estado: 'pagado',
  },
  {
    id: 'linea-7', eventoId: 'evento-1', categoria: 'floreria',
    concepto: 'Bouquet novia y damas de honor', proveedorId: 'proveedor-1',
    montoEstimado: 8500, montoReal: 8500, montoPagado: 8500, estado: 'pagado',
  },
  {
    id: 'linea-8', eventoId: 'evento-1', categoria: 'floreria',
    concepto: 'Centros de mesa (18 mesas)', proveedorId: 'proveedor-1',
    montoEstimado: 9000, montoPagado: 0, estado: 'pendiente',
  },
  // FOTOGRAFÍA (3)
  {
    id: 'linea-9', eventoId: 'evento-1', categoria: 'fotografia',
    concepto: 'Fotografía y video (10 horas)', proveedorId: 'proveedor-2',
    montoEstimado: 45000, montoPagado: 0, estado: 'pendiente',
  },
  {
    id: 'linea-10', eventoId: 'evento-1', categoria: 'fotografia',
    concepto: 'Sesión previa (e-session)', proveedorId: 'proveedor-2',
    montoEstimado: 15000, montoReal: 15000, montoPagado: 15000, estado: 'pagado',
  },
  {
    id: 'linea-11', eventoId: 'evento-1', categoria: 'fotografia',
    concepto: 'Foto booth interactivo',
    montoEstimado: 12000, montoPagado: 0, estado: 'pendiente',
  },
  // MÚSICA (2)
  {
    id: 'linea-12', eventoId: 'evento-1', categoria: 'musica',
    concepto: 'Orquesta para ceremonia y recepción', proveedorId: 'proveedor-4',
    montoEstimado: 28000, montoPagado: 14000, estado: 'pagado_parcial',
  },
  {
    id: 'linea-13', eventoId: 'evento-1', categoria: 'musica',
    concepto: 'DJ para after party (4 horas)',
    montoEstimado: 18000, montoPagado: 0, estado: 'pendiente',
  },
  // DECORACIÓN (2)
  {
    id: 'linea-14', eventoId: 'evento-1', categoria: 'decoracion',
    concepto: 'Decoración y ambientación completa', proveedorId: 'proveedor-5',
    montoEstimado: 55000, montoPagado: 0, estado: 'pendiente',
  },
  {
    id: 'linea-15', eventoId: 'evento-1', categoria: 'decoracion',
    concepto: 'Iluminación ambiental LED', proveedorId: 'proveedor-5',
    montoEstimado: 20000, montoPagado: 10000, estado: 'pagado_parcial',
  },
]

// ============================================================
// TAREAS — Evento 1
// ============================================================

export const mockTareas: Tarea[] = [
  {
    id: 'tarea-1',
    eventoId: 'evento-1',
    titulo: 'Confirmar menú final con catering',
    fase: 'Logística',
    responsable: 'Andrea Morales',
    fechaVencimiento: '2026-04-30T00:00:00.000Z',
    estado: 'en_progreso',
    orden: 1,
  },
  {
    id: 'tarea-2',
    eventoId: 'evento-1',
    titulo: 'Enviar contrato a Lente & Alma',
    fase: 'Contratación',
    responsable: 'Andrea Morales',
    fechaVencimiento: '2026-04-20T00:00:00.000Z',
    estado: 'pendiente',
    orden: 2,
  },
  {
    id: 'tarea-3',
    eventoId: 'evento-1',
    titulo: 'Prueba de vestido de novia',
    fase: 'Coordinación',
    responsable: 'Valentina García',
    fechaVencimiento: '2026-05-10T00:00:00.000Z',
    estado: 'pendiente',
    orden: 3,
  },
  {
    id: 'tarea-4',
    eventoId: 'evento-1',
    titulo: 'Visita técnica al venue',
    fase: 'Logística',
    responsable: 'Andrea Morales',
    fechaVencimiento: '2026-04-15T00:00:00.000Z',
    estado: 'completada',
    orden: 4,
  },
]

// ============================================================
// CONTRATOS
// ============================================================

export const mockContratos: Contrato[] = [
  {
    id: 'contrato-1',
    eventoId: 'evento-1',
    tipo: 'cliente',
    contraparte: 'Valentina García',
    contraparteId: 'cliente-1',
    estado: 'firmado',
    montoTotal: 85000,
    fechaCreacion: '2025-10-05T00:00:00.000Z',
    fechaEnvio: '2025-10-06T00:00:00.000Z',
    fechaFirma: '2025-10-10T00:00:00.000Z',
    version: 1,
  },
  {
    id: 'contrato-2',
    eventoId: 'evento-1',
    tipo: 'proveedor',
    contraparte: 'Flores del Valle',
    contraparteId: 'proveedor-1',
    estado: 'firmado',
    montoTotal: 40000,
    fechaCreacion: '2025-11-01T00:00:00.000Z',
    fechaEnvio: '2025-11-02T00:00:00.000Z',
    fechaFirma: '2025-11-05T00:00:00.000Z',
    version: 1,
  },
  {
    id: 'contrato-3',
    eventoId: 'evento-1',
    tipo: 'proveedor',
    contraparte: 'Lente & Alma Fotografía',
    contraparteId: 'proveedor-2',
    estado: 'enviado',
    montoTotal: 45000,
    fechaCreacion: '2026-04-08T00:00:00.000Z',
    fechaEnvio: '2026-04-09T00:00:00.000Z',
    version: 1,
  },
]

// ============================================================
// ODPs — ÓRDENES DE DESEMPEÑO
// ============================================================

export const mockODPs: ODP[] = [
  {
    id: 'odp-1',
    eventoId: 'evento-1',
    proveedorId: 'proveedor-1',
    descripcion: 'Arreglos florales para ceremonia y recepción — Boda García-Rodríguez',
    monto: 40000,
    fecha: '2026-06-15T00:00:00.000Z',
    estado: 'confirmada',
    requerimientos: 'Flores: rosas blancas, eucalipto, flores silvestres. Paleta: blanco y verde salvia. Incluye altar, 18 centros de mesa y decoración de acceso.',
  },
  {
    id: 'odp-2',
    eventoId: 'evento-1',
    proveedorId: 'proveedor-2',
    descripcion: 'Fotografía y video — Boda García-Rodríguez',
    monto: 45000,
    fecha: '2026-06-15T00:00:00.000Z',
    estado: 'pendiente',
    requerimientos: 'Cobertura desde preparativos (14:00h) hasta primer vals. Entrega: galería digital en 30 días, álbum físico en 90 días.',
  },
]

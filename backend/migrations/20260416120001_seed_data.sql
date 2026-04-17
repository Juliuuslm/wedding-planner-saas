-- ============================================================
-- Seed Data: Development environment
-- Matches the frontend mock data for parity
-- ============================================================

-- ── PLANNER ──────────────────────────────────────────────────

INSERT INTO planners (id, clerk_user_id, nombre, empresa, email, telefono, moneda, zona_horaria, creado_en)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'clerk_dev_planner_1',
  'Andrea Morales',
  'AM Wedding Studio',
  'andrea@amweddingstudio.com',
  '+52 55 1234 5678',
  'MXN',
  'America/Mexico_City',
  '2024-01-15T00:00:00Z'
);

-- ── PACKAGES ─────────────────────────────────────────────────

INSERT INTO packages (id, planner_id, nombre, descripcion, precio, servicios, activo, creado_en) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Premium',
  'Coordinación completa del evento con servicio personalizado',
  85000,
  '["Coordinación completa","Diseño de concepto","Gestión de proveedores","Día del evento","Portal del cliente"]',
  TRUE,
  NOW()
),
(
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'Esencial',
  'Coordinación del día del evento y gestión básica',
  45000,
  '["Coordinación del día","Gestión de proveedores","Portal del cliente"]',
  TRUE,
  NOW()
);

-- ── CLIENTS ──────────────────────────────────────────────────

INSERT INTO clients (id, planner_id, nombre, apellido, email, telefono, estado, notas, creado_en, actualizado_en) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Valentina', 'García',
  'valentina.garcia@email.com', '+52 55 9876 5432',
  'activo',
  'Prefiere comunicación por WhatsApp. Muy detallista con la decoración floral.',
  '2025-10-01T00:00:00Z', '2026-03-15T00:00:00Z'
),
(
  'c0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'Carmen', 'Martínez',
  'carmen.martinez@email.com', '+52 55 5555 1111',
  'activo',
  'Viaja frecuentemente. Reuniones preferentemente virtuales.',
  '2025-11-15T00:00:00Z', '2026-02-20T00:00:00Z'
),
(
  'c0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'Isabella', 'Hernández',
  'isabella.hernandez@email.com', '+52 55 3333 7777',
  'prospecto',
  'Interesada en paquete Premium. Presupuesto flexible. Evento en octubre.',
  '2026-03-01T00:00:00Z', '2026-03-01T00:00:00Z'
);

-- ── EVENTS ───────────────────────────────────────────────────

INSERT INTO events (id, planner_id, nombre, tipo, fecha, cliente_id, venue, numero_invitados, paquete_id, estado, presupuesto_total, progreso, notas, creado_en, actualizado_en) VALUES
(
  'e0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Boda García-Rodríguez', 'boda', '2026-06-15',
  'c0000000-0000-0000-0000-000000000001',
  'Hacienda San Carlos, Cuernavaca', 180,
  'b0000000-0000-0000-0000-000000000001',
  'activo', 450000, 65,
  'Estilo romántico campestre. Paleta: blanco, verde salvia y terracota.',
  '2025-10-01T00:00:00Z', '2026-04-10T00:00:00Z'
),
(
  'e0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'Boda Martínez-López', 'boda', '2026-08-22',
  'c0000000-0000-0000-0000-000000000002',
  'Hotel Camino Real, CDMX', 120,
  'b0000000-0000-0000-0000-000000000002',
  'activo', 320000, 40,
  'Estilo moderno y elegante. Paleta: negro, dorado y blanco.',
  '2025-11-15T00:00:00Z', '2026-04-05T00:00:00Z'
),
(
  'e0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'Boda Hernández-Vega', 'boda', '2026-10-10',
  'c0000000-0000-0000-0000-000000000003',
  'Por confirmar', 80,
  NULL,
  'planificacion', 200000, 15,
  'Ceremonia íntima. Estilo boho-chic. Venue en evaluación.',
  '2026-03-01T00:00:00Z', '2026-04-01T00:00:00Z'
);

-- ── VENDORS ──────────────────────────────────────────────────

INSERT INTO vendors (id, planner_id, nombre, categoria, contacto, email, telefono, whatsapp, sitio_web, descripcion, servicios, precio_base, precio_min, precio_max, calificacion, notas, creado_en) VALUES
(
  '70000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Flores del Valle', 'flores', 'Daniela Ríos',
  'contacto@floresdelvalle.mx', '+52 55 2222 3333', '+52 55 2222 3333',
  'https://floresdelvalle.mx',
  'Especialistas en arreglos florales con flores silvestres y técnicas de diseño floral artístico.',
  '["Altar nupcial","Centros de mesa","Arco floral","Bouquet de novia","Decoración de acceso"]',
  35000, 20000, 80000, 5,
  'Especialistas en flores silvestres y arreglos campestres.',
  '2024-06-01T00:00:00Z'
),
(
  '70000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'Lente & Alma Fotografía', 'fotografia', 'Rodrigo Herrera',
  'hola@lenteyalma.com', '+52 55 4444 5555', '+52 55 4444 5556',
  'https://lenteyalma.com',
  'Fotografía documental de bodas con estilo editorial. Capturamos emociones auténticas.',
  '["Fotografía de ceremonia","Fotografía de recepción","Sesión de preparativos","Álbum impreso","Galería digital"]',
  45000, 35000, 75000, 5,
  'Incluye álbum impreso y galería digital. Estilo documental.',
  '2024-03-15T00:00:00Z'
),
(
  '70000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'Gourmet Events Catering', 'catering', 'Fernanda Quiroz',
  'eventos@gourmetevents.mx', '+52 55 6666 7777', '+52 55 6666 7777',
  'https://gourmetevents.mx',
  'Catering premium para eventos sociales. Menús diseñados por chefs con más de 15 años de experiencia.',
  '["Menú de 3 tiempos","Buffet","Barra de cócteles","Mesa de postres","Vajilla y meseros"]',
  850, 600, 1500, 4,
  'Precio por persona. Mínimo 80 personas. Incluye vajilla y meseros.',
  '2024-08-20T00:00:00Z'
),
(
  '70000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000001',
  'Orquesta Romántica MX', 'musica', 'Carlos Mendoza',
  'booking@orquestaromanticamx.com', '+52 55 8888 9999', '+52 55 8888 9998',
  NULL,
  'Orquesta de 8 músicos con repertorio clásico, jazz y boleros. Más de 200 bodas realizadas.',
  '["Ceremonia religiosa","Cóctel","Recepción","Primer vals","Musicalización completa"]',
  28000, 22000, 45000, 4,
  '8 músicos. Repertorio clásico, jazz y boleros. 4 horas incluidas.',
  '2024-05-10T00:00:00Z'
),
(
  '70000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000001',
  'Ambiance Decoraciones', 'decoracion', 'Valentina Torres',
  'info@ambiancedeco.mx', '+52 55 1111 2222', '+52 55 1111 2222',
  'https://ambiancedeco.mx',
  'Diseño integral de espacios para bodas. Creamos ambientes únicos que reflejan tu personalidad.',
  '["Diseño de altar","Centros de mesa","Iluminación arquitectónica","Entrada y acceso","Coordinación de montaje"]',
  55000, 40000, 120000, 5,
  'Diseño e instalación de altar, mesas y centros. Incluye iluminación.',
  '2024-01-20T00:00:00Z'
),
(
  '70000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000001',
  'Hacienda San Carlos', 'venue', 'Roberto Salinas',
  'eventos@haciendasancarlos.mx', '+52 55 3333 4444', '+52 55 3333 4445',
  'https://haciendasancarlos.mx',
  'Hacienda del siglo XVIII con jardines, capilla y salón de 500 m². El venue perfecto para bodas de lujo.',
  '["Renta de jardín","Salón principal","Capilla colonial","Área de cóctel","Estacionamiento privado"]',
  115000, 85000, 200000, 5,
  NULL,
  '2023-11-05T00:00:00Z'
),
(
  '70000000-0000-0000-0000-000000000007',
  'a0000000-0000-0000-0000-000000000001',
  'Bella Vista Video', 'video', 'Miguel Sandoval',
  'proyectos@bellavistav.mx', '+52 55 5555 6666', '+52 55 5555 6666',
  NULL,
  'Producción cinematográfica de bodas. Video en 4K con dron, steadicam y equipo de última generación.',
  '["Video de ceremonia","Video de recepción","Película de bodas (15 min)","Reels para redes","Toma aérea con dron"]',
  32000, 25000, 60000, 4,
  NULL,
  '2024-02-14T00:00:00Z'
),
(
  '70000000-0000-0000-0000-000000000008',
  'a0000000-0000-0000-0000-000000000001',
  'Sweet Moments Pastelería', 'pasteleria', 'Ana Lim',
  'pedidos@sweetmoments.mx', '+52 55 7777 8888', '+52 55 7777 8888',
  'https://sweetmoments.mx',
  'Pasteles artísticos para bodas. Diseños personalizados con ingredientes premium y técnicas europeas.',
  '["Pastel de bodas","Naked cake","Cupcakes personalizados","Mesa de dulces","Degustación previa"]',
  8500, 5000, 25000, 5,
  NULL,
  '2024-04-03T00:00:00Z'
);

-- ── EVENT_VENDORS (assignments) ──────────────────────────────

INSERT INTO event_vendors (evento_id, proveedor_id) VALUES
('e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001'),
('e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000002'),
('e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000004'),
('e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000005'),
('e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000006');

-- ── BUDGET ITEMS ─────────────────────────────────────────────

INSERT INTO budget_items (id, planner_id, evento_id, categoria, concepto, proveedor_id, monto_estimado, monto_real, monto_pagado, estado) VALUES
-- VENUE
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'venue', 'Renta de hacienda (12 horas)', NULL, 120000, 115000, 57500, 'pagado_parcial'),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'venue', 'Depósito por daños (reembolsable)', NULL, 15000, 15000, 15000, 'pagado'),
-- CATERING
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'catering', 'Banquete 180 personas', '70000000-0000-0000-0000-000000000003', 153000, 153000, 76500, 'pagado_parcial'),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'catering', 'Barra de cócteles premium (5 horas)', '70000000-0000-0000-0000-000000000003', 25000, NULL, 0, 'pendiente'),
('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'catering', 'Pastel de bodas — 8 pisos', NULL, 12000, 12500, 12500, 'pagado'),
-- FLORES
('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'flores', 'Flores y arreglos completos', '70000000-0000-0000-0000-000000000001', 38000, 40000, 40000, 'pagado'),
('d0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'flores', 'Bouquet novia y damas de honor', '70000000-0000-0000-0000-000000000001', 8500, 8500, 8500, 'pagado'),
('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'flores', 'Centros de mesa (18 mesas)', '70000000-0000-0000-0000-000000000001', 9000, NULL, 0, 'pendiente'),
-- FOTOGRAFÍA
('d0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'fotografia', 'Fotografía y video (10 horas)', '70000000-0000-0000-0000-000000000002', 45000, NULL, 0, 'pendiente'),
('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'fotografia', 'Sesión previa (e-session)', '70000000-0000-0000-0000-000000000002', 15000, 15000, 15000, 'pagado'),
('d0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'fotografia', 'Foto booth interactivo', NULL, 12000, NULL, 0, 'pendiente'),
-- MÚSICA
('d0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'musica', 'Orquesta para ceremonia y recepción', '70000000-0000-0000-0000-000000000004', 28000, NULL, 14000, 'pagado_parcial'),
('d0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'musica', 'DJ para after party (4 horas)', NULL, 18000, NULL, 0, 'pendiente'),
-- DECORACIÓN
('d0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'decoracion', 'Decoración y ambientación completa', '70000000-0000-0000-0000-000000000005', 55000, NULL, 0, 'pendiente'),
('d0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'decoracion', 'Iluminación ambiental LED', '70000000-0000-0000-0000-000000000005', 20000, NULL, 10000, 'pagado_parcial');

-- ── TASKS ────────────────────────────────────────────────────

INSERT INTO tasks (id, planner_id, evento_id, titulo, fase, responsable, fecha_inicio, fecha_vencimiento, estado, orden) VALUES
-- Contratación
('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Enviar contrato a Lente & Alma', 'Contratación', 'Andrea Morales', '2026-04-13', '2026-04-20', 'pendiente', 1),
('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Firmar contrato con Hacienda San Carlos', 'Contratación', 'Andrea Morales', '2026-04-13', '2026-04-25', 'completada', 2),
('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Contratar DJ para after party', 'Contratación', 'Luisa Pérez', '2026-05-01', '2026-05-15', 'pendiente', 3),
-- Diseño
('f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Definir paleta de colores final', 'Diseño', 'Andrea Morales', '2026-04-13', '2026-04-30', 'completada', 4),
('f0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Aprobar maqueta de invitaciones', 'Diseño', 'Andrea Morales', '2026-04-25', '2026-05-10', 'en_progreso', 5),
-- Logística
('f0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Confirmar menú final con catering', 'Logística', 'Andrea Morales', '2026-04-20', '2026-04-30', 'en_progreso', 6),
('f0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Visita técnica al venue', 'Logística', 'Andrea Morales', '2026-04-28', '2026-05-01', 'completada', 7),
('f0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Coordinar transporte de invitados', 'Logística', 'Miguel Rodríguez', '2026-05-15', '2026-06-01', 'pendiente', 8),
-- Comunicación
('f0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Enviar save-the-date digital', 'Comunicación', 'Andrea Morales', '2026-04-13', '2026-04-18', 'atrasada', 9),
('f0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Confirmar dietary requirements con invitados', 'Comunicación', 'Luisa Pérez', '2026-05-10', '2026-05-25', 'pendiente', 10),
-- Día del evento
('f0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Prueba de vestido de novia', 'Día del evento', 'Valentina García', '2026-05-12', '2026-05-15', 'pendiente', 11),
('f0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Coordinación general día del evento', 'Día del evento', 'Andrea Morales', '2026-06-14', '2026-06-15', 'pendiente', 12),
-- Post-evento
('f0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Entrega de galería fotográfica', 'Post-evento', 'Andrea Morales', '2026-07-01', '2026-07-15', 'pendiente', 13);

-- ── CONTRACTS ────────────────────────────────────────────────

INSERT INTO contracts (id, planner_id, evento_id, tipo, contraparte, contraparte_id, estado, monto_total, fecha_creacion, fecha_envio, fecha_firma, version) VALUES
('90000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'cliente', 'Valentina García', 'c0000000-0000-0000-0000-000000000001', 'firmado', 85000, '2025-10-05T00:00:00Z', '2025-10-06T00:00:00Z', '2025-10-10T00:00:00Z', 1),
('90000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'proveedor', 'Flores del Valle', '70000000-0000-0000-0000-000000000001', 'firmado', 40000, '2025-11-01T00:00:00Z', '2025-11-02T00:00:00Z', '2025-11-05T00:00:00Z', 1),
('90000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'proveedor', 'Lente & Alma Fotografía', '70000000-0000-0000-0000-000000000002', 'enviado', 45000, '2026-04-08T00:00:00Z', '2026-04-09T00:00:00Z', NULL, 1),
('90000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'cliente', 'Carmen Martínez', 'c0000000-0000-0000-0000-000000000002', 'enviado', 45000, '2025-11-20T00:00:00Z', '2025-11-21T00:00:00Z', NULL, 1),
('90000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'proveedor', 'Gourmet Events Catering', '70000000-0000-0000-0000-000000000003', 'firmado', 48000, '2025-12-01T00:00:00Z', '2025-12-02T00:00:00Z', '2025-12-05T00:00:00Z', 1),
('90000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'cliente', 'Isabella Hernández', 'c0000000-0000-0000-0000-000000000003', 'borrador', 200000, '2026-03-10T00:00:00Z', NULL, NULL, 1);

-- ── ODPs ─────────────────────────────────────────────────────

INSERT INTO odp (id, planner_id, evento_id, proveedor_id, descripcion, monto, fecha, estado, requerimientos) VALUES
('80000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 'Arreglos florales para ceremonia y recepción — Boda García-Rodríguez', 40000, '2026-06-15', 'confirmada', 'Flores: rosas blancas, eucalipto, flores silvestres. Paleta: blanco y verde salvia. Incluye altar, 18 centros de mesa y decoración de acceso.'),
('80000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000002', 'Fotografía y video — Boda García-Rodríguez', 45000, '2026-06-15', 'pendiente', 'Cobertura desde preparativos (14:00h) hasta primer vals. Entrega: galería digital en 30 días, álbum físico en 90 días.'),
('80000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000005', 'Decoración integral — Boda García-Rodríguez', 65000, '2026-06-15', 'confirmada', 'Tema: garden chic. Altar con arco de flores, 20 centros de mesa con candelabros, iluminación perimetral en jardín.'),
('80000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000004', 'Orquesta para ceremonia y cóctel — Boda García-Rodríguez', 28000, '2026-06-15', 'pendiente', 'Ceremonia: Ave María + marcha nupcial. Cóctel: repertorio jazz 3 horas. Equipo de sonido propio.'),
('80000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000003', 'Catering para Boda Martínez-López', 48000, '2026-08-20', 'confirmada', 'Menú de 3 tiempos para 120 personas. Barra de refrescos y agua de sabor. Vajilla incluida.');

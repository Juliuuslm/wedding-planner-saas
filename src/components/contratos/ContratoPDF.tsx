import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Contrato, Evento, Cliente, Paquete } from '@/types'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n)

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1C1B1A',
    padding: 48,
    lineHeight: 1.5,
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  studioName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1A1A2E',
  },
  studioSub: {
    fontSize: 9,
    color: '#6B6860',
    marginTop: 2,
  },
  // Title
  titleBlock: {
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '1 solid #E5E3DC',
  },
  title: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1A1A2E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contractNum: {
    fontSize: 9,
    color: '#6B6860',
    marginTop: 4,
  },
  // Sections
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1A1A2E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottom: '0.5 solid #E5E3DC',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: 140,
    color: '#6B6860',
    fontSize: 9,
  },
  value: {
    flex: 1,
    color: '#1C1B1A',
    fontSize: 9,
  },
  // Clauses
  clauseItem: {
    marginBottom: 6,
  },
  clauseTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    marginBottom: 2,
  },
  clauseText: {
    fontSize: 8.5,
    color: '#6B6860',
    lineHeight: 1.5,
  },
  // Signatures
  signaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  signatureBlock: {
    width: '44%',
  },
  signatureLine: {
    borderBottom: '1 solid #1C1B1A',
    marginBottom: 4,
    height: 24,
  },
  signatureName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  signatureRole: {
    fontSize: 8.5,
    color: '#6B6860',
  },
  signatureDate: {
    fontSize: 8.5,
    color: '#6B6860',
    marginTop: 4,
  },
  // Divider
  divider: {
    borderBottom: '0.5 solid #E5E3DC',
    marginBottom: 16,
  },
  // Payment table
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottom: '0.5 solid #F4F3F0',
  },
  paymentLabel: {
    fontSize: 9,
    color: '#6B6860',
  },
  paymentAmount: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1C1B1A',
  },
})

const CLAUSULAS = [
  {
    num: '1',
    titulo: 'Obligaciones del Coordinador',
    texto: 'AM Wedding Studio se compromete a prestar los servicios de coordinación descritos en el presente contrato con profesionalismo, puntualidad y dedicación, asignando al personal necesario para garantizar el correcto desarrollo del evento.',
  },
  {
    num: '2',
    titulo: 'Obligaciones del Cliente',
    texto: 'El cliente se compromete a proporcionar la información necesaria para la coordinación del evento en los tiempos acordados, realizar los pagos en las fechas establecidas y tomar decisiones oportunamente para no afectar la planificación.',
  },
  {
    num: '3',
    titulo: 'Cancelación y Reembolsos',
    texto: 'En caso de cancelación del evento con más de 90 días de anticipación, se reembolsará el 50% del anticipo. Cancelaciones con menos de 90 días no serán reembolsables. Fuerza mayor evaluada caso por caso.',
  },
  {
    num: '4',
    titulo: 'Modificaciones',
    texto: 'Cualquier cambio en los términos del contrato deberá ser acordado por escrito y firmado por ambas partes. Las modificaciones de última hora sujetas a disponibilidad y posibles cargos adicionales.',
  },
  {
    num: '5',
    titulo: 'Jurisdicción',
    texto: 'Las partes acuerdan que para la interpretación y cumplimiento del presente contrato, se someten a las leyes aplicables de la Ciudad de México, renunciando a cualquier otra jurisdicción que pudiera corresponderles.',
  },
]

interface ContratoPDFProps {
  contrato: Contrato
  evento: Evento
  cliente: Cliente | undefined
  paquete: Paquete | undefined
}

export function ContratoPDF({ contrato, evento, cliente, paquete }: ContratoPDFProps) {
  const anticipo = contrato.montoTotal / 2
  const liquidacion = contrato.montoTotal / 2

  return (
    <Document title={`Contrato ${contrato.id.toUpperCase()}`}>
      <Page size="LETTER" style={styles.page}>

        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.studioName}>AM Wedding Studio</Text>
            <Text style={styles.studioSub}>andrea@amweddingstudio.mx</Text>
            <Text style={styles.studioSub}>+52 55 1234 5678</Text>
          </View>
          <View>
            <Text style={[styles.studioSub, { textAlign: 'right' }]}>Ciudad de México, México</Text>
            <Text style={[styles.studioSub, { textAlign: 'right', marginTop: 2 }]}>
              Fecha: {fmtDate(contrato.fechaCreacion)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Contrato de Servicios de Coordinación</Text>
          <Text style={styles.contractNum}>
            No. {contrato.id.toUpperCase()} · Versión {contrato.version}
          </Text>
        </View>

        {/* Partes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partes del Contrato</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Coordinadora:</Text>
            <Text style={styles.value}>Andrea Morales — AM Wedding Studio</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>
              {cliente ? `${cliente.nombre} ${cliente.apellido}` : contrato.contraparte}
            </Text>
          </View>
          {cliente?.email && (
            <View style={styles.row}>
              <Text style={styles.label}>Email del cliente:</Text>
              <Text style={styles.value}>{cliente.email}</Text>
            </View>
          )}
        </View>

        {/* Objeto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objeto del Contrato</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Servicio:</Text>
            <Text style={styles.value}>{paquete?.nombre ?? 'Coordinación de evento'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Evento:</Text>
            <Text style={styles.value}>{evento.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha del evento:</Text>
            <Text style={styles.value}>{fmtDate(evento.fecha)}</Text>
          </View>
          {evento.venue && (
            <View style={styles.row}>
              <Text style={styles.label}>Venue:</Text>
              <Text style={styles.value}>{evento.venue}</Text>
            </View>
          )}
          {evento.numeroInvitados && (
            <View style={styles.row}>
              <Text style={styles.label}>Número de invitados:</Text>
              <Text style={styles.value}>{evento.numeroInvitados} personas</Text>
            </View>
          )}
          {paquete?.descripcion && (
            <View style={[styles.row, { marginTop: 4 }]}>
              <Text style={styles.label}>Descripción:</Text>
              <Text style={styles.value}>{paquete.descripcion}</Text>
            </View>
          )}
        </View>

        {/* Monto y pagos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monto y Forma de Pago</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Honorarios totales</Text>
            <Text style={styles.paymentAmount}>{fmt(contrato.montoTotal)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Anticipo (50%) — Al firmar</Text>
            <Text style={styles.paymentAmount}>{fmt(anticipo)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Liquidación (50%) — 15 días antes del evento</Text>
            <Text style={styles.paymentAmount}>{fmt(liquidacion)}</Text>
          </View>
        </View>

        {/* Cláusulas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cláusulas</Text>
          {CLAUSULAS.map((c) => (
            <View key={c.num} style={styles.clauseItem}>
              <Text style={styles.clauseTitle}>{c.num}. {c.titulo}</Text>
              <Text style={styles.clauseText}>{c.texto}</Text>
            </View>
          ))}
        </View>

        {/* Firmas */}
        <View style={styles.signaturesRow}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Andrea Morales</Text>
            <Text style={styles.signatureRole}>Coordinadora — AM Wedding Studio</Text>
            <Text style={styles.signatureDate}>Fecha: ___________________</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>
              {cliente ? `${cliente.nombre} ${cliente.apellido}` : contrato.contraparte}
            </Text>
            <Text style={styles.signatureRole}>Cliente</Text>
            <Text style={styles.signatureDate}>Fecha: ___________________</Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}

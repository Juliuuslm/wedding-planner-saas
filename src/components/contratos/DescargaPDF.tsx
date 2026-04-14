'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContratoPDF } from './ContratoPDF'
import type { Contrato, Evento, Cliente, Paquete } from '@/types'

interface DescargaPDFProps {
  contrato: Contrato
  evento: Evento
  cliente: Cliente | undefined
  paquete: Paquete | undefined
}

export function DescargaPDF({ contrato, evento, cliente, paquete }: DescargaPDFProps) {
  return (
    <PDFDownloadLink
      document={
        <ContratoPDF
          contrato={contrato}
          evento={evento}
          cliente={cliente}
          paquete={paquete}
        />
      }
      fileName={`contrato-${contrato.id}.pdf`}
    >
      {({ loading }) => (
        <Button size="sm" disabled={loading}>
          <Download className="mr-1.5 h-4 w-4" />
          {loading ? 'Generando PDF…' : 'Descargar PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}

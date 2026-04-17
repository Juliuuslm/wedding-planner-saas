'use client'

import { useState } from 'react'
import { MessageCircle, Send, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MensajesPage() {
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)

  function handleEnviar() {
    if (!mensaje.trim()) return
    console.log('[Mensajes] Mensaje enviado:', mensaje)
    setMensaje('')
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3000)
  }

  return (
    <div className="space-y-6">

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p className="text-sm leading-relaxed text-text-secondary">
          <span className="font-medium text-text-primary">Mensajes se habilitarán próximamente.</span>{' '}
          Por ahora puedes escribir un mensaje y tu coordinadora lo recibirá por email.
          Para respuestas inmediatas, contáctala por WhatsApp o email.
        </p>
      </div>

      {/* Icon + title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
          <MessageCircle className="h-5 w-5 text-brand" />
        </div>
        <div>
          <p className="font-semibold text-text-primary">Enviar mensaje</p>
          <p className="text-xs text-text-muted">Tu coordinadora recibirá una notificación</p>
        </div>
      </div>

      {/* Compose area */}
      <div className="rounded-2xl border border-[#EAE7E0] bg-white p-5 shadow-sm space-y-3">
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje aquí…"
          rows={5}
          className="w-full resize-none rounded-xl border border-[#EAE7E0] bg-[#FAFAF9] px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 transition-all"
        />
        <div className="flex items-center justify-between gap-3">
          {enviado && (
            <p className="text-sm text-success font-medium">
              Mensaje enviado correctamente.
            </p>
          )}
          {!enviado && <span />}
          <Button
            size="sm"
            className="bg-brand text-gold hover:bg-brand/90"
            onClick={handleEnviar}
            disabled={!mensaje.trim()}
          >
            <Send className="mr-1.5 h-4 w-4" />
            Enviar
          </Button>
        </div>
      </div>

    </div>
  )
}

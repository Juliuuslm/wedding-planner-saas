import { MessageCircle } from 'lucide-react'

export default function MensajesPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
        <MessageCircle className="h-7 w-7 text-brand" />
      </div>
      <p className="mt-5 text-lg font-semibold text-text-primary">Mensajes</p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-muted">
        El chat directo con tu coordinadora estará disponible pronto.
        Por ahora, escríbenos al WhatsApp o email.
      </p>
    </div>
  )
}

export default function PortalProveedorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="flex h-14 items-center gap-3 border-b border-warm-border bg-background px-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-bold text-gold">
          AM
        </div>
        <span className="text-sm font-medium text-text-primary">Portal del Proveedor</span>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}

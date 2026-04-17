'use client'

import { useState, useMemo, useCallback } from 'react'
import Papa from 'papaparse'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { bulkCreateServicios } from '@/lib/api/servicios-proveedor'
import { toastSuccess, toastError } from '@/lib/toast'
import { cn } from '@/lib/utils'
import type { ServicioProveedor } from '@/types'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type TargetField =
  | 'nombre'
  | 'descripcion'
  | 'precio'
  | 'unidad'
  | 'cantidadTipica'
  | 'categoria'
  | 'disponible'
  | 'notas'

interface TargetFieldDef {
  key: TargetField
  label: string
  required: boolean
  hints: string[]  // palabras a fuzzy-match en el header CSV
}

const TARGET_FIELDS: TargetFieldDef[] = [
  { key: 'nombre',         label: 'Nombre',           required: true,  hints: ['nombre', 'name', 'servicio', 'producto', 'item', 'concepto'] },
  { key: 'precio',         label: 'Precio',           required: true,  hints: ['precio', 'price', 'costo', 'importe', 'valor', 'monto'] },
  { key: 'unidad',         label: 'Unidad',           required: false, hints: ['unidad', 'unit', 'medida', 'uom'] },
  { key: 'descripcion',    label: 'Descripción',      required: false, hints: ['descripcion', 'descripción', 'description', 'detalle'] },
  { key: 'categoria',      label: 'Sub-categoría',    required: false, hints: ['categoria', 'categoría', 'category', 'tipo', 'grupo'] },
  { key: 'cantidadTipica', label: 'Cantidad típica',  required: false, hints: ['cantidad', 'qty', 'typical', 'tipica', 'típica'] },
  { key: 'disponible',     label: 'Disponible',       required: false, hints: ['disponible', 'available', 'activo', 'enabled'] },
  { key: 'notas',          label: 'Notas',            required: false, hints: ['notas', 'notes', 'observaciones', 'remarks'] },
]

type RowData = Record<string, string>

interface ParsedRow {
  idx: number
  raw: RowData
  mapped: Partial<{
    nombre: string
    descripcion: string | null
    precio: number
    unidad: string
    cantidadTipica: number | null
    categoria: string | null
    disponible: boolean
    notas: string | null
  }>
  errors: string[]
  skipped: boolean
}

type Step = 1 | 2 | 3 | 4

const UNIDADES_VALIDAS = new Set(['pieza', 'hora', 'persona', 'metro', 'arreglo', 'paquete', 'kg', 'día', 'dia'])

// ─── Utils ───────────────────────────────────────────────────────────────────

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[_\s-]+/g, '')
    .trim()
}

function autoDetectMapping(headers: string[]): Record<TargetField, string> {
  const result = {} as Record<TargetField, string>
  const normalizedHeaders = headers.map((h) => ({ orig: h, norm: normalize(h) }))

  for (const field of TARGET_FIELDS) {
    for (const hint of field.hints) {
      const hn = normalize(hint)
      const match = normalizedHeaders.find((h) => h.norm === hn || h.norm.includes(hn))
      if (match) {
        result[field.key] = match.orig
        break
      }
    }
    if (!result[field.key]) {
      result[field.key] = ''  // "ignorar"
    }
  }
  return result
}

function parseBool(raw: string): boolean {
  const s = normalize(raw)
  return ['true', '1', 'si', 'sí', 'yes', 'y', 'disponible', 'activo'].includes(s)
}

function validateAndMap(
  rows: RowData[],
  mapping: Record<TargetField, string>,
): ParsedRow[] {
  return rows.map((raw, idx) => {
    const errors: string[] = []
    const mapped: ParsedRow['mapped'] = {}

    // Nombre
    const nombre = mapping.nombre ? (raw[mapping.nombre] ?? '').trim() : ''
    if (!nombre) errors.push('Nombre vacío')
    else mapped.nombre = nombre

    // Precio
    const precioRaw = mapping.precio ? (raw[mapping.precio] ?? '').trim() : ''
    if (!precioRaw) {
      errors.push('Precio vacío')
    } else {
      // Acepta formato "1,234.56" o "1234.56"
      const cleaned = precioRaw.replace(/[$\s]/g, '').replace(/,(?=\d{3}\b)/g, '')
      const num = Number(cleaned)
      if (!Number.isFinite(num) || num < 0) errors.push(`Precio inválido: "${precioRaw}"`)
      else mapped.precio = num
    }

    // Unidad
    const unidadRaw = mapping.unidad ? (raw[mapping.unidad] ?? '').trim().toLowerCase() : ''
    if (unidadRaw) {
      if (UNIDADES_VALIDAS.has(unidadRaw)) mapped.unidad = unidadRaw === 'dia' ? 'día' : unidadRaw
      else mapped.unidad = 'pieza'  // fallback silencioso a pieza
    } else {
      mapped.unidad = 'pieza'
    }

    // Descripción / Categoría / Notas (strings libres)
    if (mapping.descripcion) {
      const v = (raw[mapping.descripcion] ?? '').trim()
      mapped.descripcion = v || null
    }
    if (mapping.categoria) {
      const v = (raw[mapping.categoria] ?? '').trim()
      mapped.categoria = v || null
    }
    if (mapping.notas) {
      const v = (raw[mapping.notas] ?? '').trim()
      mapped.notas = v || null
    }

    // Cantidad típica
    if (mapping.cantidadTipica) {
      const v = (raw[mapping.cantidadTipica] ?? '').trim()
      if (v) {
        const n = parseInt(v, 10)
        if (Number.isFinite(n) && n > 0) mapped.cantidadTipica = n
        else mapped.cantidadTipica = null
      } else {
        mapped.cantidadTipica = null
      }
    }

    // Disponible
    if (mapping.disponible) {
      const v = (raw[mapping.disponible] ?? '').trim()
      mapped.disponible = v === '' ? true : parseBool(v)
    } else {
      mapped.disponible = true
    }

    return {
      idx,
      raw,
      mapped,
      errors,
      skipped: errors.length > 0,  // default: skip filas con errores
    }
  })
}

// ─── Wizard component ─────────────────────────────────────────────────────────

interface Props {
  proveedorId: string
  onImported: (servicios: ServicioProveedor[]) => void
}

export function ImportCsvWizard({ proveedorId, onImported }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>(1)
  const [fileName, setFileName] = useState('')
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvRows, setCsvRows] = useState<RowData[]>([])
  const [mapping, setMapping] = useState<Record<TargetField, string>>({} as Record<TargetField, string>)
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [importing, setImporting] = useState(false)

  function reset() {
    setStep(1)
    setFileName('')
    setCsvHeaders([])
    setCsvRows([])
    setMapping({} as Record<TargetField, string>)
    setParsedRows([])
  }

  // ── Paso 1: Upload ───────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toastError('Archivo muy grande', 'Máximo 2 MB.')
      return
    }
    setFileName(file.name)
    Papa.parse<RowData>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (result) => {
        const rows = result.data.filter((r) => Object.values(r).some((v) => v && String(v).trim()))
        if (rows.length === 0) {
          toastError('CSV vacío', 'El archivo no contiene filas.')
          return
        }
        if (rows.length > 500) {
          toastError('Demasiadas filas', 'Máximo 500 filas por importación.')
          return
        }
        const headers = result.meta.fields ?? []
        setCsvHeaders(headers)
        setCsvRows(rows)
        setMapping(autoDetectMapping(headers))
        setStep(2)
      },
      error: (err) => {
        console.error(err)
        toastError('Error al leer CSV', 'Verifica el formato y vuelve a intentar.')
      },
    })
  }, [])

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  // ── Paso 2: Map ──────────────────────────────────────────────────
  const nombreReady = mapping.nombre && mapping.nombre !== ''
  const precioReady = mapping.precio && mapping.precio !== ''
  const canAdvanceFromMap = nombreReady && precioReady

  // ── Paso 3: Validate ─────────────────────────────────────────────
  function runValidation() {
    const parsed = validateAndMap(csvRows, mapping)
    setParsedRows(parsed)
    setStep(3)
  }

  const validos = useMemo(() => parsedRows.filter((r) => !r.skipped && r.errors.length === 0), [parsedRows])
  const conErrores = useMemo(() => parsedRows.filter((r) => r.errors.length > 0), [parsedRows])

  function toggleSkip(idx: number) {
    setParsedRows((prev) =>
      prev.map((r) => (r.idx === idx ? { ...r, skipped: !r.skipped } : r)),
    )
  }

  // ── Paso 4: Confirm + Submit ─────────────────────────────────────
  async function handleImport() {
    setImporting(true)
    try {
      const payload = validos.map((r) => ({
        nombre: r.mapped.nombre!,
        precio: r.mapped.precio!,
        unidad: r.mapped.unidad ?? 'pieza',
        descripcion: r.mapped.descripcion ?? null,
        cantidadTipica: r.mapped.cantidadTipica ?? null,
        categoria: r.mapped.categoria ?? null,
        disponible: r.mapped.disponible ?? true,
        notas: r.mapped.notas ?? null,
      }))
      await bulkCreateServicios(proveedorId, payload)
      // Fetch re-cargaremos la lista en el padre. Aquí sólo confirmamos la cantidad.
      toastSuccess('Importación exitosa', `${payload.length} servicios agregados al catálogo.`)
      // Re-fetch para que el padre obtenga la data fresca con IDs reales
      onImported([])  // placeholder; padre hará refresh de página
      setOpen(false)
      reset()
      // Fuerza recarga para traer los servicios con IDs
      if (typeof window !== 'undefined') window.location.reload()
    } catch (err) {
      console.error(err)
      toastError('Error al importar', 'Verifica los datos e intenta de nuevo.')
    } finally {
      setImporting(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Upload className="mr-1.5 h-3.5 w-3.5" />
        Importar CSV
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!importing) {
            setOpen(v)
            if (!v) reset()
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar catálogo desde CSV</DialogTitle>
            <DialogDescription>
              Sube tu archivo CSV y mapea las columnas a los campos del catálogo.
            </DialogDescription>
          </DialogHeader>

          {/* Step indicator */}
          <div className="mb-2 flex items-center gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    step === n
                      ? 'bg-brand text-white'
                      : step > n
                        ? 'bg-success text-white'
                        : 'bg-muted text-text-muted',
                  )}
                >
                  {step > n ? <CheckCircle2 className="h-3.5 w-3.5" /> : n}
                </div>
                <div className={cn('text-xs', step === n ? 'font-medium text-text-primary' : 'text-text-muted')}>
                  {['Upload', 'Mapear', 'Validar', 'Confirmar'][n - 1]}
                </div>
                {n < 4 && <div className="h-px flex-1 bg-warm-border" />}
              </div>
            ))}
          </div>

          {/* STEP 1: Upload ────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4 py-4">
              <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-warm-border bg-muted/20 px-6 py-12 text-center transition-colors hover:border-brand/40"
              >
                <FileSpreadsheet className="mb-3 h-10 w-10 text-text-muted" />
                <p className="text-sm font-medium text-text-primary">Arrastra tu CSV aquí</p>
                <p className="mt-1 text-xs text-text-muted">o haz click para seleccionar</p>
                <Input
                  type="file"
                  accept=".csv,text/csv"
                  className="mt-4 max-w-xs"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                  }}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-2.5 text-xs text-text-secondary">
                <span>Acepta .csv UTF-8 · máximo 500 filas · 2 MB.</span>
                <a
                  href="/templates/catalogo-ejemplo.csv"
                  download
                  className="inline-flex items-center gap-1 font-medium text-brand hover:underline"
                >
                  <Download className="h-3 w-3" />
                  Descargar plantilla
                </a>
              </div>
            </div>
          )}

          {/* STEP 2: Map ────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="truncate">{fileName}</span>
                <Badge variant="outline" className="text-xs">{csvRows.length} filas</Badge>
              </div>

              <div className="space-y-2 rounded-xl border border-warm-border p-4">
                {TARGET_FIELDS.map((field) => (
                  <div key={field.key} className="grid grid-cols-[160px_1fr] items-center gap-3">
                    <label className="text-sm text-text-secondary">
                      {field.label}
                      {field.required && <span className="ml-1 text-danger">*</span>}
                    </label>
                    <select
                      value={mapping[field.key] ?? ''}
                      onChange={(e) =>
                        setMapping((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                    >
                      <option value="">— ignorar —</option>
                      {csvHeaders.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Preview primeras 3 filas */}
              <div className="overflow-x-auto rounded-xl border border-warm-border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50">
                    <tr>
                      {csvHeaders.slice(0, 6).map((h) => (
                        <th key={h} className="border-b border-warm-border px-3 py-2 text-left font-medium">
                          {h}
                        </th>
                      ))}
                      {csvHeaders.length > 6 && <th className="px-3 py-2 text-text-muted">...</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {csvRows.slice(0, 3).map((r, i) => (
                      <tr key={i} className="border-b border-warm-border last:border-0">
                        {csvHeaders.slice(0, 6).map((h) => (
                          <td key={h} className="px-3 py-1.5 text-text-secondary">{r[h] ?? ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: Validate ───────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  {validos.length} válidas
                </Badge>
                {conErrores.length > 0 && (
                  <Badge variant="outline" className="border-danger/30 bg-danger/10 text-danger">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {conErrores.length} con errores
                  </Badge>
                )}
              </div>

              {conErrores.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-primary">Filas con errores</p>
                  <div className="max-h-60 overflow-y-auto rounded-xl border border-warm-border">
                    {conErrores.map((row) => (
                      <div
                        key={row.idx}
                        className="flex items-start gap-3 border-b border-warm-border p-3 last:border-0"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-text-primary">
                            Fila {row.idx + 2}: {row.raw[mapping.nombre] ?? '(sin nombre)'}
                          </p>
                          <p className="mt-0.5 text-xs text-danger">{row.errors.join(' · ')}</p>
                        </div>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => toggleSkip(row.idx)}
                          title={row.skipped ? 'Restaurar' : 'Saltar'}
                        >
                          <X className={cn('h-3.5 w-3.5', row.skipped && 'opacity-30')} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-text-muted">
                    Las filas con errores se saltarán por defecto. Puedes corregirlas en tu CSV y volver a subirlo.
                  </p>
                </div>
              )}

              {/* Preview de válidas */}
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-text-secondary">
                  Ver vista previa de {validos.length} filas válidas
                </summary>
                <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-warm-border">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="border-b border-warm-border px-3 py-2 text-left">Nombre</th>
                        <th className="border-b border-warm-border px-3 py-2 text-right">Precio</th>
                        <th className="border-b border-warm-border px-3 py-2 text-left">Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validos.slice(0, 10).map((r) => (
                        <tr key={r.idx} className="border-b border-warm-border last:border-0">
                          <td className="px-3 py-1.5">{r.mapped.nombre}</td>
                          <td className="px-3 py-1.5 text-right tabular-nums">${r.mapped.precio?.toLocaleString('es-MX')}</td>
                          <td className="px-3 py-1.5">{r.mapped.unidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          )}

          {/* STEP 4: Confirm ────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-warm-border bg-muted/30 p-6 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-success" />
                <p className="text-lg font-semibold text-text-primary">
                  Listo para importar {validos.length} servicios
                </p>
                {conErrores.length > 0 && (
                  <p className="mt-1 text-xs text-text-muted">
                    {conErrores.filter((r) => r.skipped).length} filas se saltarán
                  </p>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Archivo:</span>
                  <span className="text-text-primary">{fileName}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Servicios a importar:</span>
                  <span className="font-semibold text-text-primary tabular-nums">{validos.length}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Precio promedio:</span>
                  <span className="tabular-nums text-text-primary">
                    ${(validos.reduce((s, r) => s + (r.mapped.precio ?? 0), 0) / Math.max(1, validos.length)).toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation ────────────────────────────────────────────── */}
          <DialogFooter className="mt-4">
            {step > 1 && step < 4 && (
              <Button variant="outline" size="sm" onClick={() => setStep((s) => (s - 1) as Step)}>
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Atrás
              </Button>
            )}
            {step === 2 && (
              <Button
                size="sm"
                disabled={!canAdvanceFromMap}
                onClick={runValidation}
                className="sm:ml-auto"
              >
                Validar
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            )}
            {step === 3 && (
              <Button
                size="sm"
                disabled={validos.length === 0}
                onClick={() => setStep(4)}
                className="sm:ml-auto"
              >
                Continuar
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            )}
            {step === 4 && (
              <>
                <Button variant="outline" size="sm" onClick={() => setStep(3)}>
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Atrás
                </Button>
                <Button
                  size="sm"
                  disabled={importing || validos.length === 0}
                  onClick={handleImport}
                  className="sm:ml-auto"
                >
                  {importing ? 'Importando...' : `Importar ${validos.length} servicios`}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

'use client'

import { useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { TareaCard } from './TareaCard'
import type { Tarea } from '@/types'

const FASES = ['Contratación', 'Diseño', 'Logística', 'Comunicación', 'Día del evento', 'Post-evento']

function SortableTarea({ tarea }: { tarea: Tarea }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tarea.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-1.5">
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab p-0.5 text-text-muted/50 hover:text-text-muted active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1">
        <TareaCard tarea={tarea} />
      </div>
    </div>
  )
}

export function ListaView({ tareas }: { tareas: Tarea[] }) {
  const [localTareas, setLocalTareas] = useState<Tarea[]>(tareas)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setLocalTareas((prev) => {
        const oldIndex = prev.findIndex((t) => t.id === active.id)
        const newIndex = prev.findIndex((t) => t.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const porFase = useMemo(() => {
    const map = new Map<string, Tarea[]>()
    for (const fase of FASES) map.set(fase, [])
    for (const t of localTareas) {
      if (map.has(t.fase)) map.get(t.fase)!.push(t)
      else map.set(t.fase, [t])
    }
    for (const [, items] of map) {
      items.sort(
        (a, b) =>
          new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime()
      )
    }
    return map
  }, [localTareas])

  const allIds = localTareas.map((t) => t.id)

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={allIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {FASES.map((fase) => {
            const items = porFase.get(fase) ?? []
            if (items.length === 0) return null
            return (
              <div key={fase}>
                <h3 className="mb-2 text-sm font-semibold text-text-primary">
                  {fase}
                  <span className="ml-2 text-xs font-normal text-text-muted">
                    ({items.length} {items.length === 1 ? 'tarea' : 'tareas'})
                  </span>
                </h3>
                <div className="space-y-1.5">
                  {items.map((t) => (
                    <SortableTarea key={t.id} tarea={t} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </SortableContext>
    </DndContext>
  )
}

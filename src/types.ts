export interface Cliente {
  id: string
  nombre: string
  fechaCreacion: string
}

export interface Supervisor {
  id: string
  nombre: string
  fechaCreacion: string
}

export interface Zona {
  id: string
  nombre: string
  clienteId: string
  fechaCreacion: string
}

export interface Item {
  id: string
  nombre: string
  zonaId: string
  fechaCreacion: string
  estado?: 'bien' | 'revision' | null
  observacion?: string
}

export type EstadoItem = 'revisar' | 'cumple'

export interface ItemInspeccionado {
  itemId: string
  estado: EstadoItem
  anotaciones: string
}

export interface Inspeccion {
  id: string
  supervisorId: string
  clienteId: string
  fecha: string
  hora: string
  items: ItemInspeccionado[]
}

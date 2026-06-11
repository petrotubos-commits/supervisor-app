import { useState, useRef } from 'react'
import type { Cliente, Supervisor, Inspeccion } from '../types'
import { Header } from '../components/Header'

interface SupervisorViewProps {
  clientes: Cliente[]
  supervisores: Supervisor[]
  zonas: any[]
  items: any[]
  inspecciones: Inspeccion[]
  agregarSupervisor: (nombre: string) => void
  eliminarSupervisor: (id: string) => void
  actualizarEstadoItem?: (id: string, estado: 'bien' | 'revision' | null, observacion: string) => void
  guardarInspeccion?: (inspeccion: Inspeccion) => void
  eliminarInspeccion?: (inspeccionId: string) => void
  onVolver: () => void
}

type Paso = 'menu' | 'crear-supervisor' | 'opciones-supervisor' | 'seleccionar-cliente' | 'seleccionar-zona' | 'inspeccionar-items' | 'observacion-item' | 'resumen-observaciones' | 'resumen-guardado' | 'ver-inspecciones'

export function SupervisorView({
  clientes,
  supervisores,
  zonas,
  items,
  inspecciones = [],
  agregarSupervisor,
  actualizarEstadoItem,
  guardarInspeccion,
  eliminarInspeccion
}: SupervisorViewProps) {
  const [paso, setPaso] = useState<Paso>('menu')
  const [nuevoSupervisorNombre, setNuevoSupervisorNombre] = useState('')
  const [supervisorSeleccionado, setSupervisorSeleccionado] = useState<{ id: string; nombre: string } | null>(null)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<{ id: string; nombre: string } | null>(null)
  const [zonaSeleccionada, setZonaSeleccionada] = useState<{ id: string; nombre: string } | null>(null)
  const [observacionTexto, setObservacionTexto] = useState('')
  const [mostrarModalDuplicado, setMostrarModalDuplicado] = useState(false)
  const [zonaIntentandoSeleccionar, setZonaIntentandoSeleccionar] = useState<{ id: string; nombre: string } | null>(null)
  const [inspeccionDuplicada, setInspeccionDuplicada] = useState<string | null>(null)
  const [respuestas, setRespuestas] = useState<Map<string, { estado: 'revisar' | 'cumple', anotaciones: string }>>(new Map())
  const [itemActual, setItemActual] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const observacionRef = useRef<HTMLTextAreaElement>(null)

  const handleCrearSupervisor = (nombre: string) => {
    if (nombre.trim()) {
      agregarSupervisor(nombre)
      setNuevoSupervisorNombre('')
      setPaso('menu')
    }
  }

  const handleSeleccionarSupervisor = (supervisor: { id: string; nombre: string }) => {
    setSupervisorSeleccionado(supervisor)
    setPaso('opciones-supervisor')
  }

  const handleSeleccionarCliente = (cliente: { id: string; nombre: string }) => {
    setClienteSeleccionado(cliente)
    setPaso('seleccionar-zona')
  }

  const handleSeleccionarZona = (zona: { id: string; nombre: string }) => {
    const existeInspeccion = inspecciones.some(
      i => i.supervisorId === supervisorSeleccionado?.id &&
           i.items.some(item => items.find(it => it.id === item.itemId)?.zonaId === zona.id)
    )

    if (existeInspeccion) {
      setZonaIntentandoSeleccionar(zona)
      const insp = inspecciones.find(
        i => i.supervisorId === supervisorSeleccionado?.id &&
             i.items.some(item => items.find(it => it.id === item.itemId)?.zonaId === zona.id)
      )
      setInspeccionDuplicada(insp?.id || null)
      setMostrarModalDuplicado(true)
    } else {
      setZonaSeleccionada(zona)
      setItemActual(0)
      setRespuestas(new Map())
      setPaso('inspeccionar-items')
    }
  }

  const handleReemplazarInspeccion = () => {
    if (inspeccionDuplicada && eliminarInspeccion) {
      eliminarInspeccion(inspeccionDuplicada)
    }
    setMostrarModalDuplicado(false)
    setZonaSeleccionada(zonaIntentandoSeleccionar)
    setItemActual(0)
    setRespuestas(new Map())
    setPaso('inspeccionar-items')
  }

  const itemsDeLaZona = zonaSeleccionada ? items.filter(i => i.zonaId === zonaSeleccionada.id) : []
  const itemActualObj = itemsDeLaZona[itemActual]

  const handleResponderItem = (estado: 'revisar' | 'cumple') => {
    const nuevasRespuestas = new Map(respuestas)
    nuevasRespuestas.set(itemActualObj.id, { estado, anotaciones: observacionTexto })
    setRespuestas(nuevasRespuestas)

    if (itemActual < itemsDeLaZona.length - 1) {
      setItemActual(itemActual + 1)
      setObservacionTexto('')
    } else {
      setPaso('resumen-observaciones')
    }
  }

  const handleGuardarInspeccion = () => {
    if (!guardarInspeccion || !supervisorSeleccionado || !clienteSeleccionado || !zonaSeleccionada) return

    const itemsInspeccionados = Array.from(respuestas.entries()).map(([itemId, datos]) => ({
      itemId,
      estado: datos.estado,
      anotaciones: datos.anotaciones
    }))

    itemsInspeccionados.forEach((item) => {
      if (actualizarEstadoItem) {
        const estado = item.estado === 'cumple' ? 'bien' : ('revision' as const)
        actualizarEstadoItem(item.itemId, estado, item.anotaciones)
      }
    })

    const ahora = new Date()
    const inspeccion: Inspeccion = {
      id: Date.now().toString(),
      supervisorId: supervisorSeleccionado.id,
      clienteId: clienteSeleccionado.id,
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toTimeString().slice(0, 5),
      items: itemsInspeccionados
    }

    guardarInspeccion(inspeccion)
    setPaso('resumen-guardado')
  }

  const inspeccionesDelSupervisor = supervisorSeleccionado
    ? inspecciones.filter(i => i.supervisorId === supervisorSeleccionado.id)
    : []

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f6' }}>
      <Header />

      <main style={{ padding: '20px 16px' }}>
        {paso === 'menu' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                onClick={() => setPaso('crear-supervisor')}
                style={{
                  width: '100%',
                  backgroundColor: '#e8f5e9',
                  border: '3px solid #5C9E2E',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#2d5016'
                }}
              >
                ➕ Crear Supervisor
              </button>

              <div style={{ fontSize: '14px', color: '#666', textAlign: 'center', padding: '16px 0' }}>
                O selecciona uno existente:
              </div>

              {supervisores.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  No hay supervisores. Crea uno para comenzar.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {supervisores.map((sup) => (
                    <button
                      key={sup.id}
                      onClick={() => handleSeleccionarSupervisor({ id: sup.id, nombre: sup.nombre })}
                      style={{
                        width: '100%',
                        backgroundColor: 'white',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#5C9E2E'
                        e.currentTarget.style.backgroundColor = '#f0f7eb'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ddd'
                        e.currentTarget.style.backgroundColor = 'white'
                      }}
                    >
                      👤 {sup.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {paso === 'crear-supervisor' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Crear Nuevo Supervisor</h2>
            <input
              ref={inputRef}
              type="text"
              value={nuevoSupervisorNombre}
              onChange={(e) => setNuevoSupervisorNombre(e.target.value)}
              placeholder="Nombre del supervisor"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCrearSupervisor(nuevoSupervisorNombre)
                }
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleCrearSupervisor(nuevoSupervisorNombre)}
                style={{
                  flex: 1,
                  backgroundColor: '#5C9E2E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Crear
              </button>
              <button
                onClick={() => { setPaso('menu'); setNuevoSupervisorNombre(''); }}
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  color: '#666',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {paso === 'opciones-supervisor' && supervisorSeleccionado && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
                👤 {supervisorSeleccionado.nombre}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => setPaso('seleccionar-cliente')}
                  style={{
                    width: '100%',
                    backgroundColor: '#5C9E2E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✏️ Realizar Inspección
                </button>

                <button
                  onClick={() => setPaso('ver-inspecciones')}
                  style={{
                    width: '100%',
                    backgroundColor: '#003087',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  📋 Ver Inspecciones Realizadas ({inspeccionesDelSupervisor.length})
                </button>

                <button
                  onClick={() => setPaso('menu')}
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    color: '#666',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    padding: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ← Volver al Menú
                </button>
              </div>
            </div>
          </div>
        )}

        {paso === 'seleccionar-cliente' && supervisorSeleccionado && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>Selecciona Cliente</h2>
            {clientes.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                No hay clientes configurados
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {clientes.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSeleccionarCliente({ id: c.id, nombre: c.nombre })}
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#003087'
                      e.currentTarget.style.backgroundColor = '#f0f4ff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#ddd'
                      e.currentTarget.style.backgroundColor = 'white'
                    }}
                  >
                    🏢 {c.nombre}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setPaso('opciones-supervisor')}
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: '#666',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ← Atrás
            </button>
          </div>
        )}

        {paso === 'seleccionar-zona' && clienteSeleccionado && supervisorSeleccionado && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
              Selecciona Zona - {clienteSeleccionado.nombre}
            </h2>
            {zonas.filter(z => z.clienteId === clienteSeleccionado.id).length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                No hay zonas para este cliente
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {zonas.filter(z => z.clienteId === clienteSeleccionado.id).map((z) => (
                  <button
                    key={z.id}
                    onClick={() => handleSeleccionarZona({ id: z.id, nombre: z.nombre })}
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#5C9E2E'
                      e.currentTarget.style.backgroundColor = '#f0f7eb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#ddd'
                      e.currentTarget.style.backgroundColor = 'white'
                    }}
                  >
                    🗺️ {z.nombre}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setPaso('seleccionar-cliente')}
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: '#666',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ← Atrás
            </button>
          </div>
        )}

        {paso === 'inspeccionar-items' && itemActualObj && zonaSeleccionada && clienteSeleccionado && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                {clienteSeleccionado.nombre} → {zonaSeleccionada.nombre}
              </p>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>
                Item {itemActual + 1} de {itemsDeLaZona.length}
              </p>

              <div style={{ backgroundColor: '#f0f4ff', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: 0 }}>
                  {itemActualObj.nombre}
                </h3>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                  Anotaciones (opcional)
                </label>
                <textarea
                  ref={observacionRef}
                  value={observacionTexto}
                  onChange={(e) => setObservacionTexto(e.target.value)}
                  placeholder="Escribe aquí si hay alguna observación..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '80px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => handleResponderItem('cumple')}
                  style={{
                    width: '100%',
                    backgroundColor: '#5C9E2E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✓ Cumple las expectativas
                </button>
                <button
                  onClick={() => handleResponderItem('revisar')}
                  style={{
                    width: '100%',
                    backgroundColor: '#d97706',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ⚠️ Revisar
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginTop: 0, marginBottom: '8px', color: '#333' }}>
                Progreso:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {itemsDeLaZona.map((item) => {
                  const respondido = respuestas.has(item.id)
                  const estado = respuestas.get(item.id)?.estado
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: respondido ? '#f9fafb' : 'white',
                        borderLeft: `4px solid ${respondido ? (estado === 'cumple' ? '#5C9E2E' : '#d97706') : '#ccc'}`,
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <p style={{ margin: 0, color: respondido ? '#333' : '#999' }}>
                        {item.nombre}
                        {respondido && (
                          <span style={{ marginLeft: '8px', color: estado === 'cumple' ? '#5C9E2E' : '#d97706' }}>
                            {estado === 'cumple' ? '✓' : '⚠️'}
                          </span>
                        )}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {paso === 'resumen-observaciones' && supervisorSeleccionado && clienteSeleccionado && zonaSeleccionada && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: 0, marginBottom: '16px' }}>
                Reporte de Inspección
              </h2>

              <div style={{ marginBottom: '16px', fontSize: '13px', lineHeight: '1.8' }}>
                <p style={{ margin: '8px 0' }}><strong>Supervisor:</strong> {supervisorSeleccionado.nombre}</p>
                <p style={{ margin: '8px 0' }}><strong>Cliente:</strong> {clienteSeleccionado.nombre}</p>
                <p style={{ margin: '8px 0' }}><strong>Zona:</strong> {zonaSeleccionada.nombre}</p>
                <p style={{ margin: '8px 0' }}><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
              </div>

              <div style={{ borderTop: '2px solid #eee', paddingTop: '16px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginTop: 0, marginBottom: '12px' }}>
                  Items que requieren revisión:
                </h3>
                {Array.from(respuestas.entries()).filter(([_, datos]) => datos.estado === 'revisar').length === 0 ? (
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                    Todos los items cumplen las expectativas ✓
                  </p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {Array.from(respuestas.entries()).filter(([_, datos]) => datos.estado === 'revisar').map(([itemId, datos]) => {
                      const item = itemsDeLaZona.find(i => i.id === itemId)
                      return (
                        <li key={itemId} style={{ fontSize: '12px', marginBottom: '8px' }}>
                          <strong>{item?.nombre}</strong>
                          {datos.anotaciones && (
                            <p style={{ fontSize: '11px', color: '#666', margin: '4px 0 0 0' }}>
                              📝 {datos.anotaciones}
                            </p>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={handleGuardarInspeccion}
                  style={{
                    width: '100%',
                    backgroundColor: '#5C9E2E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✓ Guardar Inspección
                </button>

                <button
                  onClick={() => {
                    setZonaSeleccionada(null)
                    setItemActual(0)
                    setRespuestas(new Map())
                    setObservacionTexto('')
                    setPaso('seleccionar-zona')
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    color: '#003087',
                    border: '2px solid #003087',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  → Inspeccionar otra zona
                </button>

                <button
                  onClick={() => {
                    setZonaSeleccionada(null)
                    setItemActual(0)
                    setRespuestas(new Map())
                    setObservacionTexto('')
                    setPaso('opciones-supervisor')
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    color: '#666',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ← Volver
                </button>
              </div>
            </div>
          </div>
        )}

        {paso === 'resumen-guardado' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#e8f5e9', borderRadius: '12px', padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>✓</div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d5016', marginTop: 0, marginBottom: '8px' }}>
                Inspección Guardada
              </h2>
              <p style={{ fontSize: '14px', color: '#5C9E2E', marginBottom: '32px' }}>
                La inspección ha sido guardada exitosamente
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => {
                    setZonaSeleccionada(null)
                    setItemActual(0)
                    setRespuestas(new Map())
                    setObservacionTexto('')
                    setPaso('opciones-supervisor')
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#5C9E2E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ← Volver a Opciones
                </button>

                <button
                  onClick={() => {
                    setClienteSeleccionado(null)
                    setSupervisorSeleccionado(null)
                    setZonaSeleccionada(null)
                    setItemActual(0)
                    setRespuestas(new Map())
                    setObservacionTexto('')
                    setPaso('menu')
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    color: '#666',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ← Ir al Menú Principal
                </button>
              </div>
            </div>
          </div>
        )}

        {paso === 'ver-inspecciones' && supervisorSeleccionado && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
              Inspecciones de {supervisorSeleccionado.nombre}
            </h2>

            {inspeccionesDelSupervisor.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
                No hay inspecciones registradas para este supervisor
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {inspeccionesDelSupervisor.map((insp) => {
                  const cliente = clientes.find(c => c.id === insp.clienteId)
                  const itemsConObservacion = insp.items.filter(i => i.estado === 'revisar')
                  return (
                    <div
                      key={insp.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '16px',
                        borderLeft: '4px solid #5C9E2E'
                      }}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
                          📋 {cliente?.nombre}
                        </p>
                        <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>
                          {insp.fecha} • {insp.hora}
                        </p>
                      </div>

                      {itemsConObservacion.length > 0 && (
                        <div style={{ backgroundColor: '#fff8f0', borderRadius: '6px', padding: '8px', marginBottom: '12px' }}>
                          <p style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: 'bold', color: '#d97706' }}>
                            ⚠️ Items que necesitan revisión:
                          </p>
                          <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            {itemsConObservacion.map((item) => {
                              const itemObj = items.find(i => i.id === item.itemId)
                              return (
                                <li key={item.itemId} style={{ fontSize: '11px', color: '#333', marginBottom: '2px' }}>
                                  {itemObj?.nombre}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          if (eliminarInspeccion) {
                            eliminarInspeccion(insp.id)
                          }
                        }}
                        style={{
                          width: '100%',
                          backgroundColor: '#ffebee',
                          color: '#c62828',
                          border: '1px solid #ef5350',
                          borderRadius: '6px',
                          padding: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <button
              onClick={() => setPaso('opciones-supervisor')}
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: '#666',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Volver
            </button>
          </div>
        )}

        {mostrarModalDuplicado && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: 0, marginBottom: '12px', color: '#d97706' }}>
                ⚠️ Esta zona ya fue inspeccionada
              </h2>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                {zonaIntentandoSeleccionar?.nombre} ya tiene una inspección registrada. ¿Deseas reemplazarla?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handleReemplazarInspeccion}
                  style={{
                    width: '100%',
                    backgroundColor: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F57C00'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF9800'
                  }}
                >
                  🔄 Reemplazar
                </button>

                <button
                  onClick={() => {
                    setMostrarModalDuplicado(false)
                    setZonaIntentandoSeleccionar(null)
                    setInspeccionDuplicada(null)
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    color: '#666',
                    border: '2px solid #ddd',
                    borderRadius: '12px',
                    padding: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#999'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd'
                  }}
                >
                  ← Regresar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

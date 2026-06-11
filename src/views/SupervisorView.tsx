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

export function SupervisorView({
  clientes,
  supervisores,
  zonas,
  items,
  inspecciones = [],
  agregarSupervisor,
  eliminarSupervisor,
  actualizarEstadoItem,
  guardarInspeccion,
  eliminarInspeccion,
  onVolver
}: SupervisorViewProps) {
  const [paso, setPaso] = useState<'menu' | 'crear-supervisor' | 'opciones-supervisor' | 'seleccionar-cliente' | 'seleccionar-zona' | 'inspeccionar-items' | 'observacion-item' | 'resumen-observaciones' | 'resumen-guardado' | 'ver-inspecciones'>('menu')
  const [nuevoSupervisorNombre, setNuevoSupervisorNombre] = useState('')
  const [supervisorRecienCreado, setSupervisorRecienCreado] = useState<string | null>(null)
  const [supervisorSeleccionado, setSupervisorSeleccionado] = useState<{ id: string; nombre: string } | null>(null)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<{ id: string; nombre: string } | null>(null)
  const [zonaSeleccionada, setZonaSeleccionada] = useState<{ id: string; nombre: string } | null>(null)
  const [itemConObservacion, setItemConObservacion] = useState<{ id: string; nombre: string } | null>(null)
  const [observacionTexto, setObservacionTexto] = useState('')
  const [observacionAdicional, setObservacionAdicional] = useState('')
  const [mostrarModalDuplicado, setMostrarModalDuplicado] = useState(false)
  const [zonaIntentandoSeleccionar, setZonaIntentandoSeleccionar] = useState<{ id: string; nombre: string } | null>(null)
  const [inspeccionDuplicada, setInspeccionDuplicada] = useState<string | null>(null)
  const [inspeccionesSeleccionadas, setInspeccionesSeleccionadas] = useState<Set<string>>(new Set())

  const inputRef = useRef<HTMLInputElement>(null)
  const observacionRef = useRef<HTMLTextAreaElement>(null)

  const handleCrearSupervisor = (nombre: string) => {
    if (nombre.trim()) {
      agregarSupervisor(nombre)
      setSupervisorRecienCreado(nombre)
      setNuevoSupervisorNombre('')
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 0)
    }
  }

  const fecha = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

  console.log('SupervisorView - inspecciones recibidas:', inspecciones)

  const handleSelectSupervisor = (supervisor: { id: string; nombre: string }) => {
    setSupervisorSeleccionado(supervisor)
    setPaso('opciones-supervisor')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f6' }}>
      <Header />

      <main style={{ padding: '40px 16px' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {paso === 'menu' && (
            <button
              onClick={() => setPaso('crear-supervisor')}
              style={{
                width: '100%',
                backgroundColor: '#f3e5f5',
                border: '3px solid #7b1fa2',
                borderRadius: '16px',
                padding: '32px 24px',
                minHeight: '160px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '56px', marginBottom: '16px', display: 'block' }}>👁️</div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#6a1b9a', margin: '0 0 12px 0' }}>
                Supervisores
              </h2>
              <p style={{ fontSize: '14px', color: '#7b1fa2', margin: 0 }}>
                Crear y supervisar
              </p>
            </button>
          )}

          {paso === 'crear-supervisor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: 'white',
                border: '3px solid #7b1fa2',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#6a1b9a', marginTop: 0, marginBottom: '24px' }}>
                  Crear Nuevo Supervisor
                </h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  Ingresa el nombre del supervisor
                </p>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ej: Juan García, María López"
                  value={nuevoSupervisorNombre}
                  onChange={(e) => setNuevoSupervisorNombre(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCrearSupervisor(nuevoSupervisorNombre)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    marginBottom: '8px'
                  }}
                  autoFocus
                />
                <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                  Presiona ENTER para guardar
                </p>
              </div>

              {supervisorRecienCreado && (
                <div style={{
                  backgroundColor: '#f3e5f5',
                  border: '3px solid #7b1fa2',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '24px', margin: '0 0 8px 0' }}>✓</p>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6a1b9a', margin: 0 }}>
                    {supervisorRecienCreado}
                  </h3>
                </div>
              )}

              {supervisores.length > 0 && (
                <div style={{
                  backgroundColor: 'white',
                  border: '3px solid #1976d2',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6a1b9a', margin: '0 0 16px 0' }}>
                    Supervisores Existentes ({supervisores.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                    {supervisores.map((supervisor) => (
                      <button
                        key={supervisor.id}
                        onClick={() => handleSelectSupervisor({ id: supervisor.id, nombre: supervisor.nombre })}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: '#f5f5f5',
                          borderLeft: '4px solid #7b1fa2',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#333',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#7b1fa2'
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5'
                          e.currentTarget.style.color = '#333'
                        }}
                      >
                        👁️ {supervisor.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onVolver}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '3px solid #7b1fa2',
                  color: '#7b1fa2',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                ← Regresar al Menú
              </button>
            </div>
          )}

          {paso === 'opciones-supervisor' && supervisorSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#f3e5f5',
                border: '3px solid #7b1fa2',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                  Supervisor seleccionado:
                </p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#6a1b9a', margin: 0 }}>
                  {supervisorSeleccionado.nombre}
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => setPaso('seleccionar-cliente')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '3px solid #7b1fa2',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#6a1b9a',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3e5f5'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  📋 Iniciar Inspección
                </button>

                <button
                  onClick={() => setPaso('ver-inspecciones')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '3px solid #1976d2',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#1565c0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e3f2fd'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  📊 Ver Inspecciones
                </button>

                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar supervisor "${supervisorSeleccionado.nombre}"?`)) {
                      eliminarSupervisor(supervisorSeleccionado.id)
                      setPaso('crear-supervisor')
                      setSupervisorSeleccionado(null)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '3px solid #dc2626',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#dc2626',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  🗑️ Eliminar Supervisor
                </button>
              </div>

              <button
                onClick={() => {
                  setPaso('crear-supervisor')
                  setSupervisorSeleccionado(null)
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '3px solid #7b1fa2',
                  color: '#7b1fa2',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                ← Volver a Supervisores
              </button>
            </div>
          )}

          {paso === 'ver-inspecciones' && supervisorSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#f3e5f5',
                border: '3px solid #7b1fa2',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                  Supervisor:
                </p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#6a1b9a', margin: 0 }}>
                  {supervisorSeleccionado.nombre}
                </h2>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #1976d2',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1565c0', margin: '0 0 16px 0' }}>
                  📊 Inspecciones Realizadas
                </h2>

                {(inspecciones || []).filter(i => i.supervisorId === supervisorSeleccionado.id).length === 0 ? (
                  <p style={{ fontSize: '14px', color: '#999', textAlign: 'center', padding: '20px' }}>
                    No hay inspecciones registradas para este supervisor
                  </p>
                ) : (
                  {inspeccionesSeleccionadas.size > 0 && (
                    <div style={{
                      backgroundColor: '#fff3cd',
                      border: '2px solid #FF9800',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#F57C00' }}>
                        {inspeccionesSeleccionadas.size} inspección{inspeccionesSeleccionadas.size > 1 ? 'es' : ''} seleccionada{inspeccionesSeleccionadas.size > 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar ${inspeccionesSeleccionadas.size} inspección${inspeccionesSeleccionadas.size > 1 ? 'es' : ''}?`)) {
                            inspeccionesSeleccionadas.forEach(id => {
                              if (eliminarInspeccion) {
                                eliminarInspeccion(id)
                              }
                            })
                            setInspeccionesSeleccionadas(new Set())
                          }
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#991b1b'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                    {(inspecciones || []).filter(i => i.supervisorId === supervisorSeleccionado.id).map((inspeccion) => {
                      const cliente = clientes.find(c => c.id === inspeccion.clienteId)
                      const zonaDelItem = items.length > 0 && inspeccion.items.length > 0
                        ? zonas.find(z => z.id === items.find(item => item.id === inspeccion.items[0]?.itemId)?.zonaId)
                        : null
                      const itemsConObservaciones = inspeccion.items.filter(item => item.estado === 'revisar')
                      const estaSeleccionada = inspeccionesSeleccionadas.has(inspeccion.id)

                      return (
                        <div
                          key={inspeccion.id}
                          style={{
                            backgroundColor: estaSeleccionada ? '#fff9e6' : (itemsConObservaciones.length > 0 ? '#fff3cd' : '#e8f5e9'),
                            border: `3px solid ${estaSeleccionada ? '#FF6F00' : (itemsConObservaciones.length > 0 ? '#FF9800' : '#5C9E2E')}`,
                            borderRadius: '12px',
                            padding: '16px',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                          onClick={() => {
                            const nueva = new Set(inspeccionesSeleccionadas)
                            if (estaSeleccionada) {
                              nueva.delete(inspeccion.id)
                            } else {
                              nueva.add(inspeccion.id)
                            }
                            setInspeccionesSeleccionadas(nueva)
                          }}
                        >
                          {estaSeleccionada && (
                            <div style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              width: '24px',
                              height: '24px',
                              backgroundColor: '#FF6F00',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '14px'
                            }}>
                              ✓
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                            <div>
                              <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>
                                Cliente:
                              </p>
                              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1565c0', margin: '0 0 12px 0' }}>
                                {cliente?.nombre}
                              </p>
                              {zonaDelItem && (
                                <>
                                  <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>
                                    Zona:
                                  </p>
                                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#5C9E2E', margin: 0 }}>
                                    📍 {zonaDelItem.nombre}
                                  </p>
                                </>
                              )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>
                                Fecha y Hora:
                              </p>
                              <p style={{ fontSize: '13px', fontWeight: '500', color: '#333', margin: 0 }}>
                                {inspeccion.fecha} - {inspeccion.hora}
                              </p>
                            </div>
                          </div>

                          <div style={{ marginBottom: '12px' }}>
                            <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', margin: '0 0 8px 0' }}>
                              📋 Todos los Items:
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {inspeccion.items.map((item, idx) => {
                                const itemData = items.find(i => i.id === item.itemId)
                                const esBien = item.estado === 'cumple'
                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: '8px 10px',
                                      backgroundColor: esBien ? '#f0f9f0' : '#fff5f0',
                                      borderLeft: `3px solid ${esBien ? '#4CAF50' : '#FF5252'}`,
                                      borderRadius: '4px',
                                      fontSize: '12px'
                                    }}
                                  >
                                    <span style={{ color: '#333', fontWeight: '500' }}>
                                      {itemData?.nombre || 'Item desconocido'}
                                    </span>
                                    <span style={{ fontSize: '18px' }}>
                                      {esBien ? '✅' : '❌'}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {itemsConObservaciones.length > 0 && (
                            <div style={{
                              backgroundColor: 'white',
                              borderLeft: '4px solid #FF9800',
                              padding: '12px',
                              borderRadius: '6px',
                              marginBottom: '12px'
                            }}>
                              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#F57C00', margin: '0 0 8px 0' }}>
                                ⚠️ Observaciones ({itemsConObservaciones.length}):
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {itemsConObservaciones.map((item, idx) => (
                                  <div key={idx} style={{ fontSize: '12px', color: '#333', borderBottom: idx < itemsConObservaciones.length - 1 ? '1px solid #eee' : 'none', paddingBottom: '8px' }}>
                                    <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>
                                      {items.find(i => i.id === item.itemId)?.nombre || 'Item desconocido'}
                                    </p>
                                    <p style={{ margin: 0, color: '#666', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                                      {item.anotaciones}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                              ✅ Cumplimientos: {inspeccion.items.filter(i => i.estado === 'cumple').length}
                            </span>
                            {itemsConObservaciones.length > 0 && (
                              <span style={{ fontSize: '11px', backgroundColor: '#ffebee', color: '#c62828', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                                ❌ Revisar: {itemsConObservaciones.length}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setPaso('opciones-supervisor')
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '3px solid #7b1fa2',
                  color: '#7b1fa2',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                ← Volver
              </button>
            </div>
          )}

          {paso === 'seleccionar-cliente' && supervisorSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#f3e5f5',
                border: '3px solid #7b1fa2',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                  Supervisor:
                </p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#6a1b9a', margin: 0 }}>
                  {supervisorSeleccionado.nombre}
                </h2>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #7b1fa2',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#6a1b9a', marginTop: 0, marginBottom: '24px' }}>
                  Selecciona un Cliente
                </h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                  Elige el cliente que deseas supervisar
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {clientes.length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#999', textAlign: 'center', padding: '20px' }}>
                      No hay clientes configurados
                    </p>
                  ) : (
                    clientes.map((cliente) => (
                      <button
                        key={cliente.id}
                        onClick={() => {
                          setClienteSeleccionado({ id: cliente.id, nombre: cliente.nombre })
                          setPaso('seleccionar-zona')
                        }}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: '#f5f5f5',
                          borderLeft: '4px solid #7b1fa2',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#333',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#7b1fa2'
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5'
                          e.currentTarget.style.color = '#333'
                        }}
                      >
                        🏢 {cliente.nombre}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setPaso('opciones-supervisor')
                  setClienteSeleccionado(null)
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '3px solid #7b1fa2',
                  color: '#7b1fa2',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                ← Volver
              </button>
            </div>
          )}

          {paso === 'seleccionar-zona' && supervisorSeleccionado && clienteSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#f3e5f5',
                border: '3px solid #7b1fa2',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '11px', color: '#666', margin: '0 0 6px 0' }}>
                  Supervisor:
                </p>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#6a1b9a', margin: '0 0 12px 0' }}>
                  {supervisorSeleccionado.nombre}
                </h3>
                <p style={{ fontSize: '11px', color: '#666', margin: '0 0 6px 0' }}>
                  Cliente:
                </p>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#6a1b9a', margin: 0 }}>
                  {clienteSeleccionado.nombre}
                </h3>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #7b1fa2',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#6a1b9a', marginTop: 0, marginBottom: '24px' }}>
                  Selecciona una Zona
                </h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                  Elige la zona a inspeccionar
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {zonas.filter(z => z.clienteId === clienteSeleccionado.id).length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#999', textAlign: 'center', padding: '20px' }}>
                      No hay zonas creadas para este cliente
                    </p>
                  ) : (
                    zonas.filter(z => z.clienteId === clienteSeleccionado.id).map((zona) => (
                      <button
                        key={zona.id}
                        onClick={() => {
                          // Verificar si ya existe una inspección para esta zona del mismo supervisor
                          const inspeccionExistente = (inspecciones || []).find(
                            i => i.supervisorId === supervisorSeleccionado.id &&
                                 i.clienteId === clienteSeleccionado.id &&
                                 i.items.some(item => {
                                   const itemData = items.find(it => it.id === item.itemId)
                                   return itemData?.zonaId === zona.id
                                 })
                          )

                          if (inspeccionExistente) {
                            // Mostrar modal personalizado
                            setZonaIntentandoSeleccionar({ id: zona.id, nombre: zona.nombre })
                            setInspeccionDuplicada(inspeccionExistente.id)
                            setMostrarModalDuplicado(true)
                          } else {
                            setZonaSeleccionada({ id: zona.id, nombre: zona.nombre })
                            setPaso('inspeccionar-items')
                          }
                        }}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: '#f5f5f5',
                          borderLeft: '4px solid #7b1fa2',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#333',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#7b1fa2'
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5'
                          e.currentTarget.style.color = '#333'
                        }}
                      >
                        📍 {zona.nombre}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setPaso('seleccionar-cliente')
                  setZonaSeleccionada(null)
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '3px solid #7b1fa2',
                  color: '#7b1fa2',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                ← Volver
              </button>
            </div>
          )}

          {paso === 'inspeccionar-items' && supervisorSeleccionado && clienteSeleccionado && zonaSeleccionada && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#f3e5f5',
                border: '3px solid #7b1fa2',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '10px', color: '#666', margin: '0 0 4px 0' }}>
                  Supervisor:
                </p>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6a1b9a', margin: '0 0 8px 0' }}>
                  {supervisorSeleccionado.nombre}
                </h3>
                <p style={{ fontSize: '10px', color: '#666', margin: '0 0 4px 0' }}>
                  Cliente:
                </p>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6a1b9a', margin: '0 0 8px 0' }}>
                  {clienteSeleccionado.nombre}
                </h3>
                <p style={{ fontSize: '10px', color: '#666', margin: '0 0 4px 0' }}>
                  Zona:
                </p>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#5C9E2E', margin: 0 }}>
                  {zonaSeleccionada.nombre}
                </h3>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #1976d2',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6a1b9a', margin: '0 0 16px 0' }}>
                  Items a Inspeccionar ({items.filter(i => i.zonaId === zonaSeleccionada.id).length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
                  {items.filter(i => i.zonaId === zonaSeleccionada.id).length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#999', textAlign: 'center', padding: '20px' }}>
                      No hay items en esta zona
                    </p>
                  ) : (
                    items.filter(i => i.zonaId === zonaSeleccionada.id).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: '10px 12px',
                          backgroundColor: item.estado === 'revision' ? '#ffebee' : '#f5f5f5',
                          borderLeft: `4px solid ${item.estado === 'revision' ? '#dc2626' : '#1976d2'}`,
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: item.estado === 'revision' ? '#991b1b' : '#333',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = item.estado === 'revision' ? '#fee2e2' : '#e8f5e9'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = item.estado === 'revision' ? '#ffebee' : '#f5f5f5'
                        }}
                      >
                        <span style={{ flex: 1 }}>✓ {item.nombre}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => {
                              if (actualizarEstadoItem) {
                                actualizarEstadoItem(item.id, item.estado === 'bien' ? null : 'bien', '')
                              }
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: item.estado === 'bien' ? '#4CAF50' : '#f0f0f0',
                              color: item.estado === 'bien' ? 'white' : '#333',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'all 0.2s',
                              fontWeight: 'bold'
                            }}
                            title="Bien"
                            onMouseEnter={(e) => {
                              if (item.estado !== 'bien') {
                                e.currentTarget.style.backgroundColor = '#e8f5e9'
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = item.estado === 'bien' ? '#4CAF50' : '#f0f0f0'
                            }}
                          >
                            👍
                          </button>
                          <button
                            onClick={() => {
                              setItemConObservacion({ id: item.id, nombre: item.nombre })
                              setObservacionTexto(item.observacion || '')
                              setPaso('observacion-item')
                              setTimeout(() => observacionRef.current?.focus(), 0)
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: item.estado === 'revision' ? '#FF9800' : '#f0f0f0',
                              color: item.estado === 'revision' ? 'white' : '#333',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'all 0.2s',
                              fontWeight: 'bold'
                            }}
                            title="Observación"
                            onMouseEnter={(e) => {
                              if (item.estado !== 'revision') {
                                e.currentTarget.style.backgroundColor = '#ffe0b2'
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = item.estado === 'revision' ? '#FF9800' : '#f0f0f0'
                            }}
                          >
                            👇
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setPaso('resumen-observaciones')
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F57C00'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FF9800'
                }}
              >
                📤 Enviar Observaciones
              </button>

              <button
                onClick={() => {
                  setPaso('seleccionar-zona')
                  setZonaSeleccionada(null)
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '3px solid #7b1fa2',
                  color: '#7b1fa2',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                ← Volver
              </button>
            </div>
          )}

          {paso === 'observacion-item' && itemConObservacion && zonaSeleccionada && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#fff3e0',
                border: '3px solid #FF9800',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                  Item:
                </p>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#F57C00', margin: 0 }}>
                  {itemConObservacion.nombre}
                </h2>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #FF9800',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F57C00', marginTop: 0, marginBottom: '24px' }}>
                  👇 Observación
                </h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  Escribe tu observación o comentario para este item
                </p>
                <textarea
                  ref={observacionRef}
                  placeholder="Ej: Requiere limpieza a fondo, revisar esquinas..."
                  value={observacionTexto}
                  onChange={(e) => setObservacionTexto(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    marginBottom: '24px',
                    minHeight: '100px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => {
                      if (actualizarEstadoItem) {
                        actualizarEstadoItem(itemConObservacion.id, 'revision', observacionTexto)
                      }
                      setItemConObservacion(null)
                      setObservacionTexto('')
                      setPaso('inspeccionar-items')
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F57C00'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FF9800'
                    }}
                  >
                    ✓ Guardar Observación
                  </button>

                  <button
                    onClick={() => {
                      setItemConObservacion(null)
                      setObservacionTexto('')
                      setPaso('inspeccionar-items')
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: 'white',
                      border: '3px solid #FF9800',
                      color: '#FF9800',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff3e0'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                    }}
                  >
                    ← Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {paso === 'resumen-observaciones' && supervisorSeleccionado && clienteSeleccionado && zonaSeleccionada && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#f3e5f5',
                border: '3px solid #7b1fa2',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '10px', color: '#666', margin: '0 0 4px 0' }}>
                  Supervisor:
                </p>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6a1b9a', margin: '0 0 8px 0' }}>
                  {supervisorSeleccionado.nombre}
                </h3>
                <p style={{ fontSize: '10px', color: '#666', margin: '0 0 4px 0' }}>
                  Cliente:
                </p>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6a1b9a', margin: '0 0 8px 0' }}>
                  {clienteSeleccionado.nombre}
                </h3>
                <p style={{ fontSize: '10px', color: '#666', margin: '0 0 4px 0' }}>
                  Zona:
                </p>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#5C9E2E', margin: 0 }}>
                  {zonaSeleccionada.nombre}
                </h3>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #FF9800',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F57C00', marginTop: 0, marginBottom: '24px' }}>
                  📤 Resumen de Observaciones
                </h2>

                {items.filter(i => i.zonaId === zonaSeleccionada.id && i.estado === 'revision').length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
                      ✓ No hay observaciones
                    </p>
                    <p style={{ fontSize: '12px', color: '#ccc' }}>
                      Todos los items están bien
                    </p>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#f5f5f5',
                    border: '2px solid #FF9800',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '24px',
                    maxHeight: '350px',
                    overflowY: 'auto'
                  }}>
                    {items
                      .filter(i => i.zonaId === zonaSeleccionada.id && i.estado === 'revision')
                      .map((item, index) => (
                        <div
                          key={item.id}
                          style={{
                            marginBottom: index < items.filter(i => i.zonaId === zonaSeleccionada.id && i.estado === 'revision').length - 1 ? '16px' : '0',
                            paddingBottom: index < items.filter(i => i.zonaId === zonaSeleccionada.id && i.estado === 'revision').length - 1 ? '16px' : '0',
                            borderBottom: index < items.filter(i => i.zonaId === zonaSeleccionada.id && i.estado === 'revision').length - 1 ? '2px solid #ddd' : 'none'
                          }}
                        >
                          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#F57C00', margin: '0 0 8px 0' }}>
                            {index + 1}. {item.nombre}
                          </p>
                          <p style={{ fontSize: '13px', color: '#333', margin: '0', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                            {item.observacion}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                <div style={{
                  backgroundColor: '#f9f9f9',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: '0 0 12px 0' }}>
                    📝 Observación Adicional (Opcional)
                  </p>
                  <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
                    Agrega un comentario general si lo consideras necesario
                  </p>
                  <textarea
                    placeholder="Ej: Revisar especialmente las áreas altas, solicitar reporte fotográfico..."
                    value={observacionAdicional}
                    onChange={(e) => setObservacionAdicional(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '13px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => {
                      // Crear la inspección con todos los items respondidos
                      const itemsInspeccionados: any[] = items
                        .filter(i => i.zonaId === zonaSeleccionada.id && (i.estado === 'bien' || i.estado === 'revision'))
                        .map((item) => {
                          const estado: 'revisar' | 'cumple' = item.estado === 'bien' ? 'cumple' : 'revisar'
                          return {
                            itemId: item.id,
                            estado: estado,
                            anotaciones: item.observacion || ''
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

                      // Guardar la inspección
                      if (guardarInspeccion) {
                        console.log('💾 Guardando inspección en SupervisorView:', inspeccion)
                        guardarInspeccion(inspeccion)
                      }

                      // Ir al paso de resumen guardado
                      setPaso('resumen-guardado')
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#5C9E2E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4a8a24'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#5C9E2E'
                    }}
                  >
                    💾 Guardar Resumen
                  </button>

                  <button
                    onClick={() => {
                      setPaso('inspeccionar-items')
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: 'white',
                      border: '3px solid #FF9800',
                      color: '#FF9800',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff3e0'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                    }}
                  >
                    ← Volver a Editar
                  </button>
                </div>
              </div>
            </div>
          )}

          {paso === 'resumen-guardado' && supervisorSeleccionado && clienteSeleccionado && zonaSeleccionada && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#e8f5e9',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '48px', margin: '0 0 8px 0' }}>✅</p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32', margin: 0 }}>
                  Resumen Guardado
                </h2>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1565c0', margin: '0 0 16px 0' }}>
                  📊 Resumen de Inspección
                </h3>

                <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #eee' }}>
                  <p style={{ fontSize: '13px', color: '#666', margin: '0 0 4px 0' }}>
                    <strong>Cliente:</strong> {clienteSeleccionado.nombre}
                  </p>
                  <p style={{ fontSize: '13px', color: '#666', margin: '0 0 4px 0' }}>
                    <strong>Zona:</strong> {zonaSeleccionada.nombre}
                  </p>
                  <p style={{ fontSize: '13px', color: '#666', margin: '0 0 4px 0' }}>
                    <strong>Supervisor:</strong> {supervisorSeleccionado.nombre}
                  </p>
                  <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                    <strong>Fecha:</strong> {fecha}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', margin: '0 0 12px 0' }}>
                    Items Inspeccionados:
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                      ✅ Cumplimientos: {items.filter(i => i.zonaId === zonaSeleccionada.id && i.estado === 'bien').length}
                    </span>
                    {items.filter(i => i.zonaId === zonaSeleccionada.id && i.estado === 'revision').length > 0 && (
                      <span style={{ fontSize: '11px', backgroundColor: '#ffebee', color: '#c62828', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                        ❌ Revisión: {items.filter(i => i.zonaId === zonaSeleccionada.id && i.estado === 'revision').length}
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', margin: '0 0 20px 0' }}>
                  ¿Deseas enviar este resumen por WhatsApp?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => {
                      const observacionesTexto = items
                        .filter(i => i.zonaId === zonaSeleccionada.id && i.estado === 'revision')
                        .map((item, index) => `${index + 1}. ${item.nombre}:\n${item.observacion}`)
                        .join('\n\n')

                      const mensajeCompleto = `OBSERVACIONES DE INSPECCIÓN\n\nCliente: ${clienteSeleccionado.nombre}\nZona: ${zonaSeleccionada.nombre}\nSupervisor: ${supervisorSeleccionado.nombre}\nFecha: ${fecha}\n\n${observacionesTexto}${observacionAdicional ? `\n\nNOTA ADICIONAL:\n${observacionAdicional}` : ''}`

                      alert(`Mensaje preparado para enviar:\n\n${mensajeCompleto}\n\nEn un navegador real, se abriría WhatsApp para enviar.`)

                      setObservacionAdicional('')
                      setPaso('seleccionar-zona')
                      setZonaSeleccionada(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#25D366',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#20ba5e'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#25D366'
                    }}
                  >
                    💬 Enviar por WhatsApp
                  </button>

                  <button
                    onClick={() => {
                      setObservacionAdicional('')
                      setPaso('seleccionar-zona')
                      setZonaSeleccionada(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: 'white',
                      color: '#5C9E2E',
                      border: '3px solid #5C9E2E',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f8f0'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                    }}
                  >
                    ✓ Guardar sin Enviar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Modal para zona duplicada */}
        {mostrarModalDuplicado && zonaIntentandoSeleccionar && (
          <div
            style={{
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
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px 24px',
                maxWidth: '380px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', margin: '0 0 12px 0' }}>
                Zona ya inspeccionada
              </h2>
              <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                La zona <strong>{zonaIntentandoSeleccionar.nombre}</strong> ya fue inspeccionada.
              </p>
              <p style={{ fontSize: '13px', color: '#999', margin: '0 0 28px 0' }}>
                ¿Deseas continuar? Se reemplazará la inspección anterior.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => {
                    // Eliminar la inspección anterior
                    if (eliminarInspeccion && inspeccionDuplicada) {
                      eliminarInspeccion(inspeccionDuplicada)
                      console.log('🗑️ Inspección anterior eliminada:', inspeccionDuplicada)
                    }
                    setZonaSeleccionada(zonaIntentandoSeleccionar)
                    setPaso('inspeccionar-items')
                    setMostrarModalDuplicado(false)
                    setZonaIntentandoSeleccionar(null)
                    setInspeccionDuplicada(null)
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    backgroundColor: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F57C00'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 152, 0, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF9800'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)'
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
                    padding: '14px 16px',
                    backgroundColor: 'white',
                    color: '#666',
                    border: '2px solid #ddd',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#999'
                    e.currentTarget.style.color = '#333'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd'
                    e.currentTarget.style.color = '#666'
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

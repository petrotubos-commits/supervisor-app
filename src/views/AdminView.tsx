import { useState, useRef } from 'react'
import type { Cliente } from '../types'
import { Header } from '../components/Header'

interface AdminViewProps {
  clientes: Cliente[]
  supervisores: any[]
  zonas: any[]
  items: any[]
  agregarCliente: (nombre: string, limpiador?: { nombre: string; whatsapp: string }) => void
  eliminarCliente: (id: string) => void
  actualizarCliente: (id: string, nombre: string) => void
  agregarSupervisor: (nombre: string) => void
  eliminarSupervisor: (id: string) => void
  agregarZona: (nombre: string, clienteId: string) => void
  agregarItem: (nombre: string, zonaId: string) => void
  eliminarItem: (id: string) => void
  actualizarItem: (id: string, nombre: string) => void
  actualizarEstadoItem: (id: string, estado: 'bien' | 'revision' | null, observacion: string) => void
  onVolver: () => void
}

export function AdminView({
  clientes,
  zonas,
  items,
  agregarCliente,
  eliminarCliente,
  actualizarCliente,
  agregarZona,
  agregarItem,
  eliminarItem,
  actualizarItem,
  actualizarEstadoItem,
  onVolver
}: AdminViewProps) {
  const [paso, setPaso] = useState<'menu' | 'crear-cliente' | 'opciones-cliente' | 'editar-cliente' | 'crear-zona' | 'crear-item' | 'opciones-item' | 'editar-item' | 'observacion-item'>('menu')
  const [nuevoClienteNombre, setNuevoClienteNombre] = useState('')
  const [nuevoLimpiadorNombre, setNuevoLimpiadorNombre] = useState('')
  const [nuevoLimpiadorWhatsapp, setNuevoLimpiadorWhatsapp] = useState('')
  const [clienteRecienCreado, setClienteRecienCreado] = useState<string | null>(null)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<{ id: string; nombre: string } | null>(null)
  const [edicionNombre, setEdicionNombre] = useState('')
  const [nuevoZonaNombre, setNuevoZonaNombre] = useState('')
  const [zonaRecienCreada, setZonaRecienCreada] = useState<string | null>(null)
  const [zonaSeleccionada, setZonaSeleccionada] = useState<{ id: string; nombre: string } | null>(null)
  const [nuevoItemNombre, setNuevoItemNombre] = useState('')
  const [itemRecienCreado, setItemRecienCreado] = useState<string | null>(null)
  const [itemSeleccionado, setItemSeleccionado] = useState<{ id: string; nombre: string } | null>(null)
  const [edicionItemNombre, setEdicionItemNombre] = useState('')
  const [itemConObservacion, setItemConObservacion] = useState<{ id: string; nombre: string } | null>(null)
  const [observacionTexto, setObservacionTexto] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const zonaInputRef = useRef<HTMLInputElement>(null)
  const itemInputRef = useRef<HTMLInputElement>(null)
  const observacionRef = useRef<HTMLTextAreaElement>(null)

  const handleCrearCliente = () => {
    if (nuevoClienteNombre.trim() && nuevoLimpiadorNombre.trim() && nuevoLimpiadorWhatsapp.trim()) {
      agregarCliente(nuevoClienteNombre, {
        nombre: nuevoLimpiadorNombre,
        whatsapp: nuevoLimpiadorWhatsapp
      })
      setClienteRecienCreado(nuevoClienteNombre)
      setNuevoClienteNombre('')
      setNuevoLimpiadorNombre('')
      setNuevoLimpiadorWhatsapp('')
      setPaso('menu')
    }
  }

  const handleSelectCliente = (cliente: { id: string; nombre: string }) => {
    setClienteSeleccionado(cliente)
    setPaso('opciones-cliente')
  }

  const handleEditarCliente = () => {
    if (clienteSeleccionado) {
      setEdicionNombre(clienteSeleccionado.nombre)
      setPaso('editar-cliente')
    }
  }

  const handleGuardarEdicion = () => {
    if (clienteSeleccionado && edicionNombre.trim()) {
      actualizarCliente(clienteSeleccionado.id, edicionNombre.trim())
      setClienteSeleccionado({ ...clienteSeleccionado, nombre: edicionNombre.trim() })
      setPaso('opciones-cliente')
    }
  }

  const handleCrearZona = () => {
    if (clienteSeleccionado && nuevoZonaNombre.trim()) {
      agregarZona(nuevoZonaNombre.trim(), clienteSeleccionado.id)
      setZonaRecienCreada(nuevoZonaNombre.trim())
      setNuevoZonaNombre('')
      setTimeout(() => {
        if (zonaInputRef.current) {
          zonaInputRef.current.focus()
        }
      }, 0)
    }
  }

  const handleSelectZona = (zona: { id: string; nombre: string }) => {
    setZonaSeleccionada(zona)
    setPaso('crear-item')
  }

  const handleCrearItem = () => {
    if (zonaSeleccionada && nuevoItemNombre.trim()) {
      agregarItem(nuevoItemNombre.trim(), zonaSeleccionada.id)
      setItemRecienCreado(nuevoItemNombre.trim())
      setNuevoItemNombre('')
      setTimeout(() => {
        if (itemInputRef.current) {
          itemInputRef.current.focus()
        }
      }, 0)
    }
  }

  const handleSelectItem = (item: { id: string; nombre: string }) => {
    setItemSeleccionado(item)
    setPaso('opciones-item')
  }

  const handleEditarItem = () => {
    if (itemSeleccionado) {
      setEdicionItemNombre(itemSeleccionado.nombre)
      setPaso('editar-item')
    }
  }

  const handleGuardarEdicionItem = () => {
    if (itemSeleccionado && edicionItemNombre.trim()) {
      actualizarItem(itemSeleccionado.id, edicionItemNombre.trim())
      setItemSeleccionado({ ...itemSeleccionado, nombre: edicionItemNombre.trim() })
      setPaso('opciones-item')
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f6' }}>
      <Header />

      <main style={{ padding: '40px 16px' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {paso === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                onClick={() => setPaso('crear-cliente')}
                style={{
                  width: '100%',
                  backgroundColor: '#e3f2fd',
                  border: '3px solid #1976d2',
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
                <div style={{ fontSize: '56px', marginBottom: '16px', display: 'block' }}>👥</div>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1565c0', margin: '0 0 12px 0' }}>
                  Clientes
                </h2>
                <p style={{ fontSize: '14px', color: '#1976d2', margin: 0 }}>
                  Crear y gestionar clientes
                </p>
              </button>

              <button
                onClick={onVolver}
                style={{
                  width: '100%',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: '2px solid #999',
                  borderRadius: '8px',
                  padding: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '15px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e0e0e0'
                  e.currentTarget.style.borderColor = '#555'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                  e.currentTarget.style.borderColor = '#999'
                }}
              >
                ← Volver al Menú Principal
              </button>
            </div>
          )}

          {paso === 'crear-cliente' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: 'white',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0', marginTop: 0, marginBottom: '24px' }}>
                  Crear Nuevo Cliente
                </h2>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    Nombre del cliente
                  </p>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ej: Mercado el Águila"
                    value={nuevoClienteNombre}
                    onChange={(e) => setNuevoClienteNombre(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      boxSizing: 'border-box'
                    }}
                    autoFocus
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    Nombre del limpiador
                  </p>
                  <input
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={nuevoLimpiadorNombre}
                    onChange={(e) => setNuevoLimpiadorNombre(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    WhatsApp del limpiador (sin espacios, ej: +573001234567)
                  </p>
                  <input
                    type="text"
                    placeholder="Ej: +573001234567"
                    value={nuevoLimpiadorWhatsapp}
                    onChange={(e) => setNuevoLimpiadorWhatsapp(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCrearCliente()
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  onClick={handleCrearCliente}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#5C9E2E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  ✓ Crear Cliente
                </button>
              </div>

              {clienteRecienCreado && (
                <div style={{
                  backgroundColor: '#e8f5e9',
                  border: '3px solid #5C9E2E',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '24px', margin: '0 0 8px 0' }}>✓</p>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1565c0', margin: 0 }}>
                    {clienteRecienCreado}
                  </h3>
                </div>
              )}

              {clientes.length > 0 && (
                <div style={{
                  backgroundColor: 'white',
                  border: '3px solid #1976d2',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1565c0', margin: '0 0 16px 0' }}>
                    Clientes Existentes ({clientes.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                    {clientes.map((cliente) => (
                      <button
                        key={cliente.id}
                        onClick={() => handleSelectCliente({ id: cliente.id, nombre: cliente.nombre })}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: '#f5f5f5',
                          borderLeft: '4px solid #5C9E2E',
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
                          e.currentTarget.style.backgroundColor = '#5C9E2E'
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5'
                          e.currentTarget.style.color = '#333'
                        }}
                      >
                        {cliente.nombre}
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
                  border: '3px solid #5C9E2E',
                  color: '#5C9E2E',
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
                ← Regresar a Configuración
              </button>
            </div>
          )}

          {paso === 'opciones-cliente' && clienteSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#e8f5e9',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                  Cliente seleccionado:
                </p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0', margin: 0 }}>
                  {clienteSeleccionado.nombre}
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handleEditarCliente}
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
                  ✏️ Editar Cliente
                </button>

                <button
                  onClick={() => setPaso('crear-zona')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '3px solid #5C9E2E',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#5C9E2E',
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
                  📍 Crear Zona
                </button>

                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar cliente "${clienteSeleccionado.nombre}"?`)) {
                      eliminarCliente(clienteSeleccionado.id)
                      setPaso('crear-cliente')
                      setClienteSeleccionado(null)
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
                  🗑️ Eliminar Cliente
                </button>
              </div>

              <button
                onClick={() => {
                  setPaso('crear-cliente')
                  setClienteSeleccionado(null)
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '3px solid #5C9E2E',
                  color: '#5C9E2E',
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
                ← Volver a Clientes
              </button>
            </div>
          )}

          {paso === 'editar-cliente' && clienteSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#e8f5e9',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                  Editando cliente:
                </p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0', margin: 0 }}>
                  {clienteSeleccionado.nombre}
                </h2>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #1976d2',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0', marginTop: 0, marginBottom: '24px' }}>
                  Editar Datos del Cliente
                </h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  Nombre del cliente
                </p>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={edicionNombre}
                  onChange={(e) => setEdicionNombre(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleGuardarEdicion()
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    marginBottom: '24px'
                  }}
                  autoFocus
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleGuardarEdicion}
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
                    ✓ Guardar Cambios
                  </button>

                  <button
                    onClick={() => setPaso('opciones-cliente')}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: 'white',
                      border: '3px solid #5C9E2E',
                      color: '#5C9E2E',
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
                    ← Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {paso === 'crear-zona' && clienteSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#e8f5e9',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                  Cliente:
                </p>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0', margin: 0 }}>
                  {clienteSeleccionado.nombre}
                </h2>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0', marginTop: 0, marginBottom: '24px' }}>
                  Crear Nueva Zona
                </h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  Ingresa el nombre de la zona
                </p>
                <input
                  ref={zonaInputRef}
                  type="text"
                  placeholder="Ej: Zona A, Zona de Acceso, Cocina"
                  value={nuevoZonaNombre}
                  onChange={(e) => setNuevoZonaNombre(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCrearZona()
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

              {zonaRecienCreada && (
                <div style={{
                  backgroundColor: '#e8f5e9',
                  border: '3px solid #5C9E2E',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '24px', margin: '0 0 8px 0' }}>✓</p>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1565c0', margin: 0 }}>
                    {zonaRecienCreada}
                  </h3>
                </div>
              )}

              {zonas.filter(z => z.clienteId === clienteSeleccionado.id).length > 0 && (
                <div style={{
                  backgroundColor: 'white',
                  border: '3px solid #1976d2',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1565c0', margin: '0 0 16px 0' }}>
                    Zonas Existentes ({zonas.filter(z => z.clienteId === clienteSeleccionado.id).length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                    {zonas.filter(z => z.clienteId === clienteSeleccionado.id).map((zona) => (
                      <button
                        key={zona.id}
                        onClick={() => handleSelectZona({ id: zona.id, nombre: zona.nombre })}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: '#f5f5f5',
                          borderLeft: '4px solid #5C9E2E',
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
                          e.currentTarget.style.backgroundColor = '#5C9E2E'
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5'
                          e.currentTarget.style.color = '#333'
                        }}
                      >
                        📍 {zona.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setPaso('opciones-cliente')
                  setZonaRecienCreada(null)
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '3px solid #5C9E2E',
                  color: '#5C9E2E',
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
                ← Volver a Opciones
              </button>
            </div>
          )}

          {paso === 'crear-item' && zonaSeleccionada && clienteSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#e8f5e9',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '11px', color: '#666', margin: '0 0 6px 0' }}>
                  Cliente:
                </p>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1565c0', margin: '0 0 12px 0' }}>
                  {clienteSeleccionado.nombre}
                </h3>
                <p style={{ fontSize: '11px', color: '#666', margin: '0 0 6px 0' }}>
                  Zona:
                </p>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#5C9E2E', margin: 0 }}>
                  {zonaSeleccionada.nombre}
                </h3>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #1976d2',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0', marginTop: 0, marginBottom: '24px' }}>
                  Crear Nuevo Item
                </h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  Ingresa el nombre del item a inspeccionar
                </p>
                <input
                  ref={itemInputRef}
                  type="text"
                  placeholder="Ej: Puerta, Piso, Temperatura"
                  value={nuevoItemNombre}
                  onChange={(e) => setNuevoItemNombre(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCrearItem()
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

              {itemRecienCreado && (
                <div style={{
                  backgroundColor: '#e8f5e9',
                  border: '3px solid #5C9E2E',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '24px', margin: '0 0 8px 0' }}>✓</p>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1565c0', margin: 0 }}>
                    {itemRecienCreado}
                  </h3>
                </div>
              )}

              {items.filter(i => i.zonaId === zonaSeleccionada.id).length > 0 && (
                <div style={{
                  backgroundColor: 'white',
                  border: '3px solid #1976d2',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1565c0', margin: '0 0 16px 0' }}>
                    Items Existentes ({items.filter(i => i.zonaId === zonaSeleccionada.id).length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
                    {items.filter(i => i.zonaId === zonaSeleccionada.id).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: '10px 12px',
                          backgroundColor: '#f5f5f5',
                          borderLeft: '4px solid #1976d2',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#333',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e8f5e9'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5'
                        }}
                      >
                        <button
                          onClick={() => handleSelectItem({ id: item.id, nombre: item.nombre })}
                          style={{
                            flex: 1,
                            padding: '0',
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#333',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          ✓ {item.nombre}
                        </button>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => {
                              actualizarEstadoItem(item.id, item.estado === 'bien' ? null : 'bien', '')
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: item.estado === 'bien' ? '#4CAF50' : '#f0f0f0',
                              color: item.estado === 'bien' ? 'white' : '#333',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '16px',
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
                              setTimeout(() => observacionRef.current?.focus(), 0)
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: item.estado === 'revision' ? '#FF9800' : '#f0f0f0',
                              color: item.estado === 'revision' ? 'white' : '#333',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '16px',
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
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setPaso('crear-zona')
                  setZonaSeleccionada(null)
                  setItemRecienCreado(null)
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '3px solid #5C9E2E',
                  color: '#5C9E2E',
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
                ← Volver a Zonas
              </button>
            </div>
          )}

          {paso === 'opciones-item' && itemSeleccionado && zonaSeleccionada && clienteSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#e8f5e9',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '11px', color: '#666', margin: '0 0 6px 0' }}>
                  Cliente:
                </p>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1565c0', margin: '0 0 12px 0' }}>
                  {clienteSeleccionado.nombre}
                </h3>
                <p style={{ fontSize: '11px', color: '#666', margin: '0 0 6px 0' }}>
                  Zona:
                </p>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#5C9E2E', margin: '0 0 12px 0' }}>
                  {zonaSeleccionada.nombre}
                </h3>
                <p style={{ fontSize: '11px', color: '#666', margin: '0 0 6px 0' }}>
                  Item:
                </p>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1565c0', margin: 0 }}>
                  {itemSeleccionado.nombre}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handleEditarItem}
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
                  ✏️ Editar Item
                </button>

                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar item "${itemSeleccionado.nombre}"?`)) {
                      eliminarItem(itemSeleccionado.id)
                      setPaso('crear-item')
                      setItemSeleccionado(null)
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
                  🗑️ Eliminar Item
                </button>
              </div>

              <button
                onClick={() => {
                  setPaso('crear-item')
                  setItemSeleccionado(null)
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: 'white',
                  border: '3px solid #5C9E2E',
                  color: '#5C9E2E',
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
                ← Volver a Items
              </button>
            </div>
          )}

          {paso === 'editar-item' && itemSeleccionado && zonaSeleccionada && clienteSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#e8f5e9',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '11px', color: '#666', margin: '0 0 6px 0' }}>
                  Editando item:
                </p>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1565c0', margin: 0 }}>
                  {itemSeleccionado.nombre}
                </h2>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '3px solid #1976d2',
                borderRadius: '16px',
                padding: '32px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0', marginTop: 0, marginBottom: '24px' }}>
                  Editar Item
                </h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  Nombre del item
                </p>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={edicionItemNombre}
                  onChange={(e) => setEdicionItemNombre(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleGuardarEdicionItem()
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    marginBottom: '24px'
                  }}
                  autoFocus
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleGuardarEdicionItem}
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
                    ✓ Guardar Cambios
                  </button>

                  <button
                    onClick={() => setPaso('opciones-item')}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: 'white',
                      border: '3px solid #5C9E2E',
                      color: '#5C9E2E',
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
                    ← Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {paso === 'observacion-item' && itemConObservacion && zonaSeleccionada && clienteSeleccionado && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#e8f5e9',
                border: '3px solid #5C9E2E',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '11px', color: '#666', margin: '0 0 6px 0' }}>
                  Item:
                </p>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1565c0', margin: 0 }}>
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
                  Mensaje para el personal de limpieza
                </p>
                <textarea
                  ref={observacionRef}
                  placeholder="Ingresa tu observación o mensaje..."
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
                      actualizarEstadoItem(itemConObservacion.id, 'revision', observacionTexto)
                      setItemConObservacion(null)
                      setObservacionTexto('')
                      setPaso('crear-item')
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
                      setPaso('crear-item')
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
        </div>
      </main>
    </div>
  )
}

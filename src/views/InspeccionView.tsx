import { useState } from 'react'
import type { Cliente, Supervisor, Zona, Item, Inspeccion } from '../types'
import { Header } from '../components/Header'

interface InspeccionViewProps {
  clientes: Cliente[]
  supervisores: Supervisor[]
  zonas: Zona[]
  items: Item[]
  guardarInspeccion: (inspeccion: Inspeccion) => void
  actualizarEstadoItem?: (id: string, estado: 'bien' | 'revision' | null, observacion: string) => void
  onVolver: () => void
}

type Etapa = 'seleccionar-supervisor' | 'seleccionar-cliente' | 'seleccionar-zona' | 'inspeccionar-items' | 'reporte'

export function InspeccionView({
  clientes,
  supervisores,
  zonas,
  items,
  guardarInspeccion,
  actualizarEstadoItem,
  onVolver
}: InspeccionViewProps) {
  const [etapa, setEtapa] = useState<Etapa>('seleccionar-supervisor')
  const [supervisorSeleccionado, setSupervisorSeleccionado] = useState('')
  const [clienteSeleccionado, setClienteSeleccionado] = useState('')
  const [zonaSeleccionada, setZonaSeleccionada] = useState('')
  const [itemActual, setItemActual] = useState(0)
  const [respuestas, setRespuestas] = useState<Map<string, { estado: 'revisar' | 'cumple', anotaciones: string }>>(new Map())
  const [anotacionesTempo, setAnotacionesTempo] = useState('')

  const zonasDelCliente = zonas.filter(z => z.clienteId === clienteSeleccionado)
  const itemsDeLaZona = items.filter(i => i.zonaId === zonaSeleccionada)
  const itemActualObj = itemsDeLaZona[itemActual]

  const handleSeleccionarSupervisor = (id: string) => {
    setSupervisorSeleccionado(id)
    setEtapa('seleccionar-cliente')
  }

  const handleSeleccionarCliente = (id: string) => {
    setClienteSeleccionado(id)
    setEtapa('seleccionar-zona')
  }

  const handleSeleccionarZona = (id: string) => {
    setZonaSeleccionada(id)
    setItemActual(0)
    setRespuestas(new Map())
    setAnotacionesTempo('')
    setEtapa('inspeccionar-items')
  }

  const handleResponderItem = (estado: 'revisar' | 'cumple') => {
    const nuevasRespuestas = new Map(respuestas)
    nuevasRespuestas.set(itemActualObj.id, { estado, anotaciones: anotacionesTempo })
    setRespuestas(nuevasRespuestas)

    if (itemActual < itemsDeLaZona.length - 1) {
      setItemActual(itemActual + 1)
      setAnotacionesTempo('')
    } else {
      setEtapa('reporte')
    }
  }

  const handleIrAOtraZona = () => {
    setEtapa('seleccionar-zona')
    setZonaSeleccionada('')
    setItemActual(0)
    setAnotacionesTempo('')
  }

  const handleGuardarInspeccion = () => {
    console.log('=== GUARDANDO INSPECCIÓN ===')
    console.log('supervisorSeleccionado:', supervisorSeleccionado)
    console.log('clienteSeleccionado:', clienteSeleccionado)
    console.log('respuestas:', respuestas)

    const itemsInspeccionados = Array.from(respuestas.entries()).map(([itemId, datos]) => ({
      itemId,
      estado: datos.estado,
      anotaciones: datos.anotaciones
    }))

    // Actualizar el estado de cada item
    itemsInspeccionados.forEach((itemInspeccionado) => {
      if (actualizarEstadoItem) {
        const estado = itemInspeccionado.estado === 'cumple' ? 'bien' : 'revision'
        actualizarEstadoItem(itemInspeccionado.itemId, estado, itemInspeccionado.anotaciones)
      }
    })

    const ahora = new Date()
    const inspeccion: Inspeccion = {
      id: Date.now().toString(),
      supervisorId: supervisorSeleccionado,
      clienteId: clienteSeleccionado,
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toTimeString().slice(0, 5),
      items: itemsInspeccionados
    }

    console.log('Inspección a guardar:', inspeccion)
    guardarInspeccion(inspeccion)
    onVolver()
  }

  const supervisor = supervisores.find(s => s.id === supervisorSeleccionado)
  const cliente = clientes.find(c => c.id === clienteSeleccionado)
  const zona = zonas.find(z => z.id === zonaSeleccionada)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f6' }}>
      <Header />

      <main className="px-4 py-6 pb-20">
        {etapa === 'seleccionar-supervisor' && (
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Selecciona tu nombre</h2>
            {supervisores.length === 0 ? (<div className="bg-white rounded-lg shadow p-6 text-center text-gray-500"><p>No hay supervisores configurados</p></div>) : (<div className="space-y-2">{supervisores.map((sup) => (<button key={sup.id} onClick={() => handleSeleccionarSupervisor(sup.id)} className="w-full bg-white rounded-lg shadow p-4 text-left border-l-4 active:shadow-md transition" style={{ borderLeftColor: '#5C9E2E' }}><h3 className="font-semibold text-gray-800">{sup.nombre}</h3></button>))}</div>)}
          </div>
        )}

        {etapa === 'seleccionar-cliente' && (
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Selecciona el cliente a inspeccionar</h2>
            {clientes.length === 0 ? (<div className="bg-white rounded-lg shadow p-6 text-center text-gray-500"><p>No hay clientes configurados</p></div>) : (<div className="space-y-2">{clientes.map((c) => (<button key={c.id} onClick={() => handleSeleccionarCliente(c.id)} className="w-full bg-white rounded-lg shadow p-4 text-left border-l-4 active:shadow-md transition" style={{ borderLeftColor: '#003087' }}><h3 className="font-semibold text-gray-800">{c.nombre}</h3></button>))}</div>)}
          </div>
        )}

        {etapa === 'seleccionar-zona' && (
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Selecciona la zona a inspeccionar</h2>
            <p className="text-sm text-gray-600">Cliente: {cliente?.nombre}</p>
            {zonasDelCliente.length === 0 ? (<div className="bg-white rounded-lg shadow p-6 text-center text-gray-500"><p>No hay zonas para este cliente</p></div>) : (<div className="space-y-2">{zonasDelCliente.map((z) => (<button key={z.id} onClick={() => handleSeleccionarZona(z.id)} className="w-full bg-white rounded-lg shadow p-4 text-left border-l-4 active:shadow-md transition" style={{ borderLeftColor: '#5C9E2E' }}><h3 className="font-semibold text-gray-800">{z.nombre}</h3></button>))}</div>)}
          </div>
        )}

        {etapa === 'inspeccionar-items' && itemActualObj && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <p className="text-sm text-gray-600 mb-2">{cliente?.nombre} → {zona?.nombre}</p>
              <p className="text-sm text-gray-600 mb-4">Item {itemActual + 1} de {itemsDeLaZona.length}</p>
              <div className="mb-6 bg-blue-50 rounded p-4" style={{ backgroundColor: '#f0f4ff' }}>
                <h3 className="text-xl font-bold text-gray-800">{itemActualObj.nombre}</h3>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Anotaciones (opcional)</label>
                <textarea value={anotacionesTempo} onChange={(e) => setAnotacionesTempo(e.target.value)} placeholder="Escribe aquí si hay alguna observación..." className="w-full px-4 py-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 resize-none" style={{ outlineColor: '#003087', minHeight: '80px' }} />
              </div>
              <div className="space-y-3">
                <button onClick={() => handleResponderItem('cumple')} className="w-full text-white font-semibold py-3 px-4 rounded text-base" style={{ backgroundColor: '#5C9E2E', minHeight: '48px' }}>✓ Cumple las expectativas</button>
                <button onClick={() => handleResponderItem('revisar')} className="w-full text-white font-semibold py-3 px-4 rounded text-base bg-orange-600" style={{ backgroundColor: '#d97706', minHeight: '48px' }}>⚠️ Revisar</button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="space-y-2">
                {itemsDeLaZona.map((item) => {
                  const respondido = respuestas.has(item.id)
                  const estado = respuestas.get(item.id)?.estado
                  return (
                    <div key={item.id} className="p-3 rounded border-l-4 flex items-center gap-3" style={{ borderLeftColor: respondido ? (estado === 'cumple' ? '#5C9E2E' : '#d97706') : '#ccc', backgroundColor: respondido ? '#f9fafb' : '#fff' }}>
                      <div className="text-sm">
                        <p className={`font-medium ${respondido ? 'text-gray-800' : 'text-gray-600'}`}>{item.nombre}</p>
                        {respondido && (<p className="text-xs" style={{ color: estado === 'cumple' ? '#5C9E2E' : '#d97706' }}>{estado === 'cumple' ? '✓ Cumple' : '⚠️ Revisar'}</p>)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {etapa === 'reporte' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Reporte de Inspección</h2>
              <div className="mb-6 space-y-2 text-sm">
                <p><strong>Supervisor:</strong> {supervisor?.nombre}</p>
                <p><strong>Cliente:</strong> {cliente?.nombre}</p>
                <p><strong>Zona:</strong> {zona?.nombre}</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                <p><strong>Hora:</strong> {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Items que requieren revisión:</h3>
                {Array.from(respuestas.entries()).filter(([_, datos]) => datos.estado === 'revisar').length === 0 ? (<p className="text-sm text-gray-600">Todos los items cumplen las expectativas ✓</p>) : (<ul className="space-y-3">{Array.from(respuestas.entries()).filter(([_, datos]) => datos.estado === 'revisar').map(([itemId, datos]) => { const item = itemsDeLaZona.find(i => i.id === itemId); return (<li key={itemId} className="bg-orange-50 p-3 rounded border-l-4" style={{ borderLeftColor: '#d97706' }}><p className="font-medium text-gray-800">{item?.nombre}</p>{datos.anotaciones && (<p className="text-xs text-gray-600 mt-2">📝 {datos.anotaciones}</p>)}</li>) })}</ul>)}
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    console.log('🔘 BOTÓN GUARDAR PRESIONADO')
                    handleGuardarInspeccion()
                  }}
                  className="w-full text-white font-semibold py-3 px-4 rounded text-base"
                  style={{ backgroundColor: '#5C9E2E', minHeight: '48px' }}
                >
                  ✓ Guardar Inspección
                </button>
                <button onClick={handleIrAOtraZona} className="w-full bg-white border-2 font-semibold py-3 px-4 rounded text-base" style={{ borderColor: '#003087', color: '#003087' }}>→ Inspeccionar otra zona</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

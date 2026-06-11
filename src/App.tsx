import { useState, useEffect } from 'react'
import type { Cliente, Supervisor, Zona, Item, Inspeccion } from './types'
import { AdminView } from './views/AdminView'
import { SupervisorView } from './views/SupervisorView'
import { InspeccionView } from './views/InspeccionView'
import { Header } from './components/Header'
import './App.css'

type Vista = 'menu' | 'admin' | 'supervisor' | 'inspeccion'

function App() {
  const [vista, setVista] = useState<Vista>('menu')
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [supervisores, setSupervisores] = useState<Supervisor[]>([])
  const [zonas, setZonas] = useState<Zona[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([])

  useEffect(() => {
    // Carga datos guardados permanentemente en localStorage
    const datosGuardados = localStorage.getItem('supervisorAppData')
    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados)
        setClientes(datos.clientes || [])
        setSupervisores(datos.supervisores || [])
        setZonas(datos.zonas || [])
        setItems(datos.items || [])
        setInspecciones(datos.inspecciones || [])
        console.log('✅ Datos cargados de localStorage:', datos.clientes.length, 'clientes')
      } catch (e) {
        console.error('Error cargando datos:', e)
      }
    } else {
      console.log('📭 Sin datos guardados - comenzando nuevo')
    }
  }, [])

  useEffect(() => {
    try {
      const datosAGuardar = {
        clientes,
        supervisores,
        zonas,
        items,
        inspecciones
      }
      console.log('💾 GUARDANDO - Clientes:', datosAGuardar.clientes.length, 'Inspecciones:', datosAGuardar.inspecciones.length)
      const serializado = JSON.stringify(datosAGuardar)
      localStorage.setItem('supervisorAppData', serializado)
      console.log('✅ Datos guardados en localStorage - Tamaño:', (serializado.length / 1024).toFixed(2), 'KB')
    } catch (error) {
      console.error('❌ Error guardando en localStorage:', error)
    }
  }, [clientes, supervisores, zonas, items, inspecciones])

  const agregarCliente = (nombre: string) => {
    const nuevoCliente: Cliente = {
      id: Date.now().toString(),
      nombre,
      fechaCreacion: new Date().toISOString()
    }
    setClientes([...clientes, nuevoCliente])
  }

  const eliminarCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id))
  }

  const actualizarCliente = (id: string, nombre: string) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, nombre } : c))
  }

  const agregarSupervisor = (nombre: string) => {
    const nuevoSupervisor: Supervisor = {
      id: Date.now().toString(),
      nombre,
      fechaCreacion: new Date().toISOString()
    }
    setSupervisores([...supervisores, nuevoSupervisor])
  }

  const eliminarSupervisor = (id: string) => {
    setSupervisores(supervisores.filter(s => s.id !== id))
  }

  const agregarZona = (nombre: string, clienteId: string) => {
    const nuevaZona: Zona = {
      id: Date.now().toString(),
      nombre,
      clienteId,
      fechaCreacion: new Date().toISOString()
    }
    setZonas([...zonas, nuevaZona])
  }

  const agregarItem = (nombre: string, zonaId: string) => {
    const nuevoItem: Item = {
      id: Date.now().toString(),
      nombre,
      zonaId,
      fechaCreacion: new Date().toISOString()
    }
    setItems([...items, nuevoItem])
  }

  const eliminarItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const actualizarItem = (id: string, nombre: string) => {
    setItems(items.map(i => i.id === id ? { ...i, nombre } : i))
  }

  const actualizarEstadoItem = (id: string, estado: 'bien' | 'revision' | null, observacion: string = '') => {
    console.log('📌 ACTUALIZANDO ESTADO ITEM:', { id, estado, observacion })
    setItems(items.map(i => {
      if (i.id === id) {
        const updated: typeof i = { ...i, estado, observacion }
        console.log('   ✅ Item actualizado:', updated)
        return updated
      }
      return i
    }))
  }

  const guardarInspeccion = (inspeccion: Inspeccion) => {
    console.log('📝 FUNCIÓN guardarInspeccion LLAMADA')
    console.log('   Inspeccion a guardar:', inspeccion)
    console.log('   Inspecciones actuales:', inspecciones)
    const nuevasInspecciones = [...inspecciones, inspeccion]
    console.log('   Nuevas inspecciones:', nuevasInspecciones)
    setInspecciones(nuevasInspecciones)
  }

  const eliminarInspeccion = (inspeccionId: string) => {
    console.log('🗑️ Eliminando inspección:', inspeccionId)
    setInspecciones(inspecciones.filter(i => i.id !== inspeccionId))
  }

  if (vista === 'admin') {
    return (
      <AdminView
        clientes={clientes}
        supervisores={supervisores}
        zonas={zonas}
        items={items}
        agregarCliente={agregarCliente}
        eliminarCliente={eliminarCliente}
        actualizarCliente={actualizarCliente}
        agregarSupervisor={agregarSupervisor}
        eliminarSupervisor={eliminarSupervisor}
        agregarZona={agregarZona}
        agregarItem={agregarItem}
        eliminarItem={eliminarItem}
        actualizarItem={actualizarItem}
        actualizarEstadoItem={actualizarEstadoItem}
        onVolver={() => setVista('menu')}
      />
    )
  }

  if (vista === 'supervisor') {
    return (
      <SupervisorView
        clientes={clientes}
        supervisores={supervisores}
        zonas={zonas}
        items={items}
        inspecciones={inspecciones}
        agregarSupervisor={agregarSupervisor}
        eliminarSupervisor={eliminarSupervisor}
        actualizarEstadoItem={actualizarEstadoItem}
        guardarInspeccion={guardarInspeccion}
        eliminarInspeccion={eliminarInspeccion}
        onVolver={() => setVista('menu')}
      />
    )
  }

  if (vista === 'inspeccion') {
    return (
      <InspeccionView
        clientes={clientes}
        supervisores={supervisores}
        zonas={zonas}
        items={items}
        guardarInspeccion={guardarInspeccion}
        actualizarEstadoItem={actualizarEstadoItem}
        onVolver={() => setVista('menu')}
      />
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f6' }}>
      <Header />

      <main style={{ padding: '40px 16px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <button
            onClick={() => setVista('admin')}
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
            <div style={{ fontSize: '56px', marginBottom: '16px', display: 'block' }}>⚙️</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1565c0', margin: '0 0 12px 0' }}>
              Configuración
            </h2>
            <p style={{ fontSize: '14px', color: '#1976d2', margin: 0 }}>
              Crear clientes y zonas
            </p>
          </button>

          <button
            onClick={() => setVista('supervisor')}
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
              Supervisión
            </h2>
            <p style={{ fontSize: '14px', color: '#7b1fa2', margin: 0 }}>
              Supervisores e inspecciones
            </p>
          </button>
        </div>
      </main>
    </div>
  )
}

export default App

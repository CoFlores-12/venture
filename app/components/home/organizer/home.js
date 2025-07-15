"use client"
import { useState } from 'react';
import { 
  FiCalendar, 
  FiUsers, 
  FiDollarSign, 
  FiSettings, 
  FiPlus, 
  FiSearch,
  FiBarChart2,
  FiUpload,
  FiDownload
} from 'react-icons/fi';
import EventCard from './EventCard';
import StatsCard from './StatsCard';
import { LuTicketCheck } from 'react-icons/lu';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');

  // Datos de ejemplo
  const events = [
    {
      id: 1,
      name: 'Festival de Música 2023',
      date: '2025-11-15',
      attendees: 450,
      revenue: 12500,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80',
      ticketTypes: [
        { name: 'General', price: 25, sold: 300 },
        { name: 'VIP', price: 75, sold: 150 }
      ]
    },
    {
      id: 2,
      name: 'Conferencia Tech',
      date: '2025-10-05',
      attendees: 200,
      revenue: 8000,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      ticketTypes: [
        { name: 'Estudiante', price: 20, sold: 120 },
        { name: 'Profesional', price: 50, sold: 80 }
      ]
    },
    {
      id: 3,
      name: 'Exposición de Arte',
      date: '2025-09-20',
      attendees: 320,
      revenue: 9500,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80',
      ticketTypes: [
        { name: 'Entrada General', price: 30, sold: 320 }
      ]
    }
  ];

  const stats = [
    { 
      title: 'Eventos Activos', 
      value: events.filter(e => e.status === 'active').length, 
      icon: <FiCalendar className="text-2xl" />,
      change: '+2',
      trend: 'up'
    },
    { 
      title: 'Total Asistentes', 
      value: events.reduce((sum, event) => sum + event.attendees, 0), 
      icon: <FiUsers className="text-2xl" />,
      change: '+120',
      trend: 'up'
    },
    { 
      title: 'Ingresos Totales', 
      value: `L.${events.reduce((sum, event) => sum + event.revenue, 0).toLocaleString()}`, 
      icon: <FiDollarSign className="text-2xl" />,
      change: '+L.5,200',
      trend: 'up'
    },
    { 
      title: 'Próximo Evento', 
      value: '15 Nov', 
      icon: <FiCalendar className="text-2xl" />,
      subtitle: 'Festival de Música'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Sidebar y Contenido Principal */}

      <div className="flex justify-center">
        <div className="flex-1 max-w-screen-sm w-full mx-auto">
            

         

          {/* Main Content */}
          <main className="p-6 sm:p-6 px-2 w-full">
            {/* Bienvenida y Estadísticas */}
            <div className="mb-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 w-full">
                {stats.map((stat, index) => (
                  <StatsCard key={index} stat={stat} />
                ))}
              </div>
            </div>

            <header className="bg-white shadow-sm mb-3 w-full max-w-full">
                <nav className="p-2 flex flex-row gap-2 w-full max-w-full">
                    <button
                    onClick={() => setActiveTab('events')}
                    className={`flex-1 min-w-0 flex items-center justify-center py-3 rounded-lg mb-2 text-sm ${activeTab === 'events' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                    <FiCalendar className="mr-2" />
                    Mis Eventos
                    </button>
                    <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex-1 min-w-0 flex items-center justify-center py-3 rounded-lg mb-2 text-sm ${activeTab === 'analytics' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                    <FiBarChart2 className="mr-2" />
                    Analíticas
                    </button>
                    <button
                    onClick={() => setActiveTab('tickets')}
                    className={`flex-1 min-w-0 flex items-center justify-center py-3 rounded-lg mb-2 text-sm ${activeTab === 'tickets' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <LuTicketCheck className='mr-2' />
                    Boletos
                    </button>
                </nav>
            </header>

            {/* Contenido según pestaña */}
            {activeTab === 'events' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Tus Eventos</h2>
                  <a
                    href='/events/new'
                    className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <FiPlus className="mr-2" />
                    Nuevo Evento
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Analíticas de Eventos</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-purple-50 p-4 rounded-lg lg:col-span-2">
                    <h3 className="font-medium text-gray-700 mb-4">Ventas de Boletos (últimos 30 días)</h3>
                    <div className="h-64 bg-white rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Gráfico de ventas aparecerá aquí</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-4">Distribución de Boletos</h3>
                    <div className="h-64 bg-white rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Gráfico circular aparecerá aquí</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-700 mb-4">Eventos más populares</h3>
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-md bg-gray-200 mr-3 overflow-hidden">
                            <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium">{event.name}</h4>
                            <p className="text-sm text-gray-500">{event.attendees} asistentes</p>
                          </div>
                        </div>
                        <span className="text-purple-600 font-medium">L.{event.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-full">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Gestión de Boletos</h2>
                
                <div className="overflow-x-auto w-full max-w-full">
                  <table className="w-full max-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Boleto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendidos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibles</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.flatMap(event => 
                        event.ticketTypes.map((ticket, index) => (
                          <tr key={`${event.id}-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img className="h-10 w-10 rounded-md" src={event.image} alt={event.name} />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{event.name}</div>
                                  <div className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">L.{ticket.price}0</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.sold}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.round(ticket.sold * 1.5)}</td>
                            
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
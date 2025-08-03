"use client"
import { useState, useEffect } from 'react';
import { useAuthUser } from '@/src/lib/authUsers';
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
import dayjs from 'dayjs';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');

  const { user, loading: userLoading } = useAuthUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/events?organizer=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.filter(event => event.organizer === user.id));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // Use dayjs for robust date comparison
  const now = dayjs();
  const activeEvents = events.filter(e => {
    // If e.date is missing, skip
    if (!e.date) return false;
    // Parse as local date (assume e.date is YYYY-MM-DD or ISO string)
    const eventEndOfDay = dayjs(e.date).endOf('day');
    return eventEndOfDay.isAfter(now);
  });
  const upcomingEvents = activeEvents;
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents.reduce((earliest, event) => dayjs(event.date).isBefore(dayjs(earliest.date)) ? event : earliest) : null;

  const stats = [
    { 
      title: 'Eventos Activos', 
      value: activeEvents.length, 
      icon: <FiCalendar className="text-2xl" />, 
      change: '',
      trend: 'up'
    },
    { 
      title: 'Total Asistentes', 
      value: events.reduce(
        (sum, event) =>
          sum +
          (event.tickets
            ? event.tickets.reduce(
                (tSum, t) =>
                  tSum + ((t.quantity || 0) - (t.quantityAvailable || 0)),
                0
              )
            : 0),
        0
      ),
      icon: <FiUsers className="text-2xl" />,
      change: '',
      trend: 'up'
    },
    { 
      title: 'Ingresos Totales', 
      value: `L.${events.reduce((sum, event) => 
        sum + (event.tickets ? event.tickets.reduce((tSum, t) => tSum + (((t.quantity || 0) - (t.quantityAvailable || 0)) * (t.price || 0)), 0) : 0)
      , 0).toLocaleString()}`,
      icon: <FiDollarSign className="text-2xl" />,
      change: '',
      trend: 'up'
    },
    { 
      title: 'Próximo Evento', 
      value: nextEvent ? nextEvent.date : '', 
      icon: <FiCalendar className="text-2xl" />,
      subtitle: nextEvent ? nextEvent.title : ''
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Sidebar y Contenido Principal */}

      <div className="flex justify-center">
        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            

         

          {/* Main Content */}
          <main className="py-4 sm:py-6 w-full">
            {/* Bienvenida y Estadísticas */}
            <div className="mb-6 sm:mb-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6 w-full">
                {stats.map((stat, index) => (
                  <div key={index} className="w-full">
                    <StatsCard stat={stat} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-full max-w-2xl">
                <header className="bg-white dark:bg-slate-800 shadow-sm w-full rounded-xl">
                    <nav className="p-2 flex flex-row gap-1 sm:gap-2 w-full">
                        <button
                        onClick={() => setActiveTab('events')}
                        className={`flex-1 min-w-0 flex items-center justify-center py-2 sm:py-3 px-2 rounded-lg mb-2 text-xs sm:text-sm font-medium ${activeTab === 'events' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'}`}
                        >
                        <FiCalendar className="mr-1 sm:mr-2 text-sm sm:text-base" />
                        <span className="hidden sm:inline">Mis Eventos</span>
                        <span className="sm:hidden">Eventos</span>
                        </button>
                        <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex-1 min-w-0 flex items-center justify-center py-2 sm:py-3 px-2 rounded-lg mb-2 text-xs sm:text-sm font-medium ${activeTab === 'analytics' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'}`}
                        >
                        <FiBarChart2 className="mr-1 sm:mr-2 text-sm sm:text-base" />
                        <span className="hidden sm:inline">Analíticas</span>
                        <span className="sm:hidden">Stats</span>
                        </button>
                        <button
                        onClick={() => setActiveTab('tickets')}
                        className={`flex-1 min-w-0 flex items-center justify-center py-2 sm:py-3 px-2 rounded-lg mb-2 text-xs sm:text-sm font-medium ${activeTab === 'tickets' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'}`}
                        >
                            <LuTicketCheck className='mr-1 sm:mr-2 text-sm sm:text-base' />
                        <span className="hidden sm:inline">Boletos</span>
                        <span className="sm:hidden">Tickets</span>
                        </button>
                    </nav>
                </header>
              </div>
            </div>

            {/* Contenido según pestaña */}
            {activeTab === 'events' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Tus Eventos</h2>
                  <a
                    href='/events/new'
                    className="w-full sm:w-auto flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <FiPlus className="mr-2" />
                    Nuevo Evento
                  </a>
                </div>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Cargando eventos...</div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No tienes eventos aún.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
                    {events.map((event) => (
                      <div key={event._id || event.id} className="w-full">
                        <EventCard event={event} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">Analíticas de Eventos</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg lg:col-span-2">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">Ventas de Boletos (últimos 30 días)</h3>
                    <div className="h-48 sm:h-64 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Gráfico de ventas aparecerá aquí</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">Distribución de Boletos</h3>
                    <div className="h-48 sm:h-64 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Gráfico circular aparecerá aquí</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">Eventos más populares</h3>
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event._id || event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-lg gap-3 sm:gap-0">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-md bg-gray-200 dark:bg-slate-600 mr-3 overflow-hidden flex-shrink-0">
                            <img src={event.banner || event.image} alt={event.title || event.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{event.title || event.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{event.attendees || 0} asistentes</p>
                          </div>
                        </div>
                        <span className="text-purple-600 dark:text-purple-400 font-medium text-sm sm:text-base">L.{(event.revenue || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm w-full">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">Gestión de Boletos</h2>
                
                <div className="overflow-x-auto w-full">
                  <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden border border-gray-200 dark:border-slate-600 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Evento</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendidos</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Disponibles</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                          {events.flatMap(event => 
                            (event.tickets || []).map((ticket, index) => (
                              <tr key={`${event._id || event.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                      <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-md object-cover" src={event.banner || event.image} alt={event.title || event.name} />
                                    </div>
                                    <div className="ml-2 sm:ml-4 min-w-0">
                                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{event.title || event.name}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">{ticket.name}</td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">L.{ticket.price}</td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">{((ticket.quantity || 0) - (ticket.quantityAvailable || 0)) || 0}</td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">{ticket.quantityAvailable || 0}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
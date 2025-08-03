"use client"
import { useState, useEffect, useMemo } from 'react';
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
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to refresh data
  const refreshData = () => {
    if (!user) return;
    
    const fetchEvents = fetch(`/api/events?organizer=${user.id}`)
      .then(res => res.json())
      .then(data => data.filter(event => event.organizer === user.id));
    
    const fetchPurchases = fetch(`/api/purchase/organizer/${user.id}`)
      .then(res => {
        if (!res.ok) {
          console.error('Purchase API error:', res.status, res.statusText);
          return [];
        }
        return res.json();
      })
      .catch(error => {
        console.error('Failed to fetch purchases:', error);
        return [];
      });
    
    Promise.all([fetchEvents, fetchPurchases])
      .then(([eventsData, purchasesData]) => {
        setEvents(eventsData);
        setPurchases(purchasesData || []);
      });
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    
    // Fetch events
    const fetchEvents = fetch(`/api/events?organizer=${user.id}`)
      .then(res => res.json())
      .then(data => data.filter(event => event.organizer === user.id));
    
    // Fetch purchases for the organizer's events
    const fetchPurchases = fetch(`/api/purchase/organizer/${user.id}`)
      .then(res => {
        if (!res.ok) {
          console.error('Purchase API error:', res.status, res.statusText);
          return [];
        }
        return res.json();
      })
      .catch(error => {
        console.error('Failed to fetch purchases:', error);
        return [];
      });
    
    Promise.all([fetchEvents, fetchPurchases])
      .then(([eventsData, purchasesData]) => {
        setEvents(eventsData);
        setPurchases(purchasesData || []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: just load events
        fetch(`/api/events?organizer=${user.id}`)
          .then(res => res.json())
          .then(data => {
            setEvents(data.filter(event => event.organizer === user.id));
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [user]);

  // Auto-refresh every 30 seconds to catch new purchases
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Generate last 30 days sales data from real purchases
  const generateLast30DaysSales = () => {
    const salesData = [];
    const today = dayjs();
    
    for (let i = 29; i >= 0; i--) {
      const date = today.subtract(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');
      
      // Calculate real sales for this specific day from purchases
      let dailySales = 0;
      
      if (purchases.length > 0) {
        // Use real purchase data
        purchases.forEach(purchase => {
          const purchaseDate = dayjs(purchase.createdAt);
          const purchaseDateStr = purchaseDate.format('YYYY-MM-DD');
          if (purchaseDateStr === dateStr) {
            dailySales += purchase.totalAmount || 0;
          }
        });
      } else {
        // Fallback: estimate from current ticket sales (for demo purposes)
        events.forEach(event => {
          if (event.tickets && event.createdAt) {
            const eventCreated = dayjs(event.createdAt);
            const daysSinceCreated = today.diff(eventCreated, 'day');
            
            if (daysSinceCreated > 0 && date.isAfter(eventCreated)) {
              const totalRevenue = event.tickets.reduce((sum, ticket) => 
                sum + (((ticket.quantity || 0) - (ticket.quantityAvailable || 0)) * (ticket.price || 0)), 0
              );
              
              // Distribute sales more evenly for demo
              const dailyPortion = totalRevenue / Math.max(daysSinceCreated, 30);
              dailySales += dailyPortion * 0.8; // More consistent than random
            }
          }
        });
      }
      
      salesData.push({
        date: dateStr,
        day: date.format('D'),
        month: date.format('MMM'),
        sales: Math.round(dailySales)
      });
    }
    
    return salesData;
  };

  const salesData = useMemo(() => generateLast30DaysSales(), [purchases, events]);
  const maxSales = Math.max(...salesData.map(d => d.sales), 1);

  // Generate ticket distribution data
  const generateTicketDistribution = () => {
    const ticketTypes = {};
    let totalSold = 0;

    // Aggregate all ticket types across all events
    events.forEach(event => {
      if (event.tickets) {
        event.tickets.forEach(ticket => {
          const sold = (ticket.quantity || 0) - (ticket.quantityAvailable || 0);
          if (sold > 0) {
            if (ticketTypes[ticket.name]) {
              ticketTypes[ticket.name] += sold;
            } else {
              ticketTypes[ticket.name] = sold;
            }
            totalSold += sold;
          }
        });
      }
    });

    // Convert to array with percentages
    const distributionData = Object.entries(ticketTypes).map(([name, count], index) => ({
      name,
      count,
      percentage: totalSold > 0 ? Math.round((count / totalSold) * 100) : 0,
      color: `hsl(${(index * 137.5) % 360}, 70%, 50%)` // Generate distinct colors
    }));

    return { distributionData, totalSold };
  };

  const { distributionData, totalSold } = useMemo(() => generateTicketDistribution(), [events]);

  // Simple Donut Chart Component
  const DonutChart = ({ data, total }) => {
    if (!data.length || total === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-3">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Sin boletos vendidos</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Los datos aparecerán aquí</p>
          </div>
        </div>
      );
    }

    // Mobile-first responsive design
    const mobileSize = 110;
    const desktopSize = 160;
    const mobileStrokeWidth = 14;
    const desktopStrokeWidth = 20;
    
    let cumulativePercentage = 0;
    
    return (
      <>
        {/* Mobile Chart */}
        <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:hidden">
          <div className="relative mb-3">
            <svg width={mobileSize} height={mobileSize} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={mobileSize / 2}
                cy={mobileSize / 2}
                r={(mobileSize - mobileStrokeWidth) / 2}
                fill="none"
                stroke="currentColor"
                strokeWidth={mobileStrokeWidth}
                className="text-gray-200 dark:text-slate-600"
              />
              
              {/* Data segments */}
              {data.map((item, index) => {
                const radius = (mobileSize - mobileStrokeWidth) / 2;
                const circumference = radius * 2 * Math.PI;
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -cumulativePercentage * circumference / 100;
                
                cumulativePercentage += item.percentage;
                
                return (
                  <circle
                    key={index}
                    cx={mobileSize / 2}
                    cy={mobileSize / 2}
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={mobileStrokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{total}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">vendidos</div>
            </div>
          </div>
          
          {/* Mobile Legend */}
          <div className="space-y-1 w-full">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center min-w-0 flex-1">
                  <div 
                    className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{item.count}</span>
                  <span className="text-gray-500 dark:text-gray-400">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Chart */}
        <div className="w-full h-full hidden sm:flex flex-col items-center justify-center p-4">
          <div className="relative mb-4">
            <svg width={desktopSize} height={desktopSize} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={desktopSize / 2}
                cy={desktopSize / 2}
                r={(desktopSize - desktopStrokeWidth) / 2}
                fill="none"
                stroke="currentColor"
                strokeWidth={desktopStrokeWidth}
                className="text-gray-200 dark:text-slate-600"
              />
              
              {/* Data segments */}
              {(() => {
                let cumulativePercentageDesktop = 0;
                return data.map((item, index) => {
                  const radius = (desktopSize - desktopStrokeWidth) / 2;
                  const circumference = radius * 2 * Math.PI;
                  const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -cumulativePercentageDesktop * circumference / 100;
                  
                  cumulativePercentageDesktop += item.percentage;
                  
                  return (
                    <circle
                      key={index}
                      cx={desktopSize / 2}
                      cy={desktopSize / 2}
                      r={radius}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={desktopStrokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  );
                });
              })()}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{total}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">vendidos</div>
            </div>
          </div>
          
          {/* Desktop Legend */}
          <div className="space-y-2 w-full max-w-xs">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center min-w-0 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{item.count}</span>
                  <span className="text-gray-500 dark:text-gray-400">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  // Simple Bar Chart Component
  const SalesChart = ({ data, maxValue }) => (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end justify-between px-2 pb-2 gap-1 h-full">
        {data.map((item, index) => {
          // Calculate the actual height percentage (0-95%) to use more vertical space
          const heightPercentage = maxValue > 0 ? (item.sales / maxValue) * 95 : 0;
          // Only show a bar if there are actual sales
          const showBar = item.sales > 0;
          // Ensure minimum visible height for bars with sales
          const barHeight = showBar ? Math.max(heightPercentage, 8) : 0;
          
          return (
            <div key={index} className="flex flex-col justify-end items-center flex-1 group h-full">
              <div 
                className={`w-full transition-all duration-200 rounded-t-sm relative ${
                  showBar 
                    ? 'bg-gradient-to-t from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-sm' 
                    : 'bg-gray-100 dark:bg-slate-600'
                }`}
                style={{ 
                  height: `${barHeight}%`,
                  minHeight: showBar ? '8px' : '2px'
                }}
                title={`${item.day} ${item.month}: L.${item.sales.toLocaleString()}`}
              >
                {/* Tooltip on hover - only show if there are sales */}
                {showBar && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    L.{item.sales.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2 pt-2 border-t border-gray-200 dark:border-slate-600">
        <span>{data[0]?.day} {data[0]?.month}</span>
        <span>Últimos 30 días</span>
        <span>{data[data.length - 1]?.day} {data[data.length - 1]?.month}</span>
      </div>
    </div>
  );

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
              <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Analíticas de Eventos</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 px-3 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {purchases.length} compras
                        </span>
                      </div>
                      <button
                        onClick={refreshData}
                        className="flex items-center justify-center px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="hidden sm:inline">Actualizar</span>
                        <span className="sm:hidden">Actualizar Datos</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                  {/* Sales Chart - Full width on mobile, 2/3 on desktop */}
                  <div className="xl:col-span-2">
                    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm h-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-base sm:text-lg">
                          Ventas de Boletos
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                          30 días
                        </span>
                      </div>
                      <div className="h-56 sm:h-64 lg:h-72 bg-gray-50 dark:bg-slate-700 rounded-lg p-3 sm:p-4">
                        {salesData.length > 0 && salesData.some(d => d.sales > 0) ? (
                          <SalesChart data={salesData} maxValue={maxSales} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-gray-400 dark:text-gray-500 mb-3">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">No hay ventas registradas</p>
                              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Los datos aparecerán aquí cuando tengas ventas</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Ticket Distribution - Full width on mobile, 1/3 on desktop */}
                  <div className="xl:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm h-full">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-base sm:text-lg">
                        Distribución de Boletos
                      </h3>
                      <div className="h-56 sm:h-64 lg:h-72 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <DonutChart data={distributionData} total={totalSold} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Debug section - showing recent purchases */}
                {purchases.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-base sm:text-lg">
                        Actividad Reciente
                      </h4>
                      <span className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                        {purchases.length} total
                      </span>
                    </div>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {purchases.slice(-5).map((purchase, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-blue-100 dark:border-blue-800 gap-2 sm:gap-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {purchase.event?.title || 'Evento sin título'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {dayjs(purchase.createdAt).format('DD/MM/YYYY HH:mm')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right sm:text-left">
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              +L.{purchase.totalAmount}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Events Section */}
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-base sm:text-lg">
                      Eventos Más Populares
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Por asistentes
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {events.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-400 dark:text-gray-500 mb-3">
                          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                          </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No tienes eventos creados</p>
                        <a 
                          href="/events/new"
                          className="inline-flex items-center mt-3 text-purple-600 dark:text-purple-400 text-sm hover:text-purple-700 dark:hover:text-purple-300"
                        >
                          Crear tu primer evento
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    ) : (
                      events
                        .map(event => {
                          // Calculate attendees (total tickets sold)
                          const attendees = event.tickets ? event.tickets.reduce((sum, ticket) => 
                            sum + ((ticket.quantity || 0) - (ticket.quantityAvailable || 0)), 0
                          ) : 0;
                          
                          // Calculate revenue (tickets sold * price)
                          const revenue = event.tickets ? event.tickets.reduce((sum, ticket) => 
                            sum + (((ticket.quantity || 0) - (ticket.quantityAvailable || 0)) * (ticket.price || 0)), 0
                          ) : 0;
                          
                          return { ...event, calculatedAttendees: attendees, calculatedRevenue: revenue };
                        })
                        .sort((a, b) => b.calculatedAttendees - a.calculatedAttendees) // Sort by attendees (most popular first)
                        .map((event, index) => (
                        <div key={event._id || event.id} className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-gray-100 dark:border-slate-600">
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="flex-shrink-0 mr-3">
                              <span className="flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-xs font-bold">
                                {index + 1}
                              </span>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 dark:bg-slate-600 mr-3 overflow-hidden flex-shrink-0">
                              <img 
                                src={event.banner || event.image} 
                                alt={event.title || event.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                                {event.title || event.name}
                              </h4>
                              <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                {event.calculatedAttendees} asistentes
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-3">
                            <span className="text-sm sm:text-base font-semibold text-purple-600 dark:text-purple-400">
                              L.{event.calculatedRevenue.toLocaleString()}
                            </span>
                            {event.calculatedRevenue > 0 && (
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Revenue
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
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
import { FiCalendar, FiUsers } from 'react-icons/fi';
import Link from 'next/link';

const EventCard = ({ event }) => {
  // Parse event.date as local date to avoid timezone issues
  let eventDate;
  if (event.date && typeof event.date === 'string' && event.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = event.date.split('-').map(Number);
    eventDate = new Date(year, month - 1, day);
  } else {
    eventDate = new Date(event.date);
  }
  const currentDate = new Date();
  const isActive = eventDate > currentDate;

  // Calculate tickets sold
  const ticketsSold = event.tickets
    ? event.tickets.reduce(
        (sum, t) => sum + ((t.quantity || 0) - (t.quantityAvailable || 0)),
        0
      )
    : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md w-full max-w-full">
      <div className="h-48 relative">
        <img src={event.banner} alt={event.name} className="w-full h-full object-cover" />
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}> 
          {isActive ? 'Activo' : 'Finalizado'}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-1 text-gray-800">{event.name}</h3>
        <p className="text-gray-500 mb-3 flex items-center">
          <FiCalendar className="mr-2" />
          {eventDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <FiUsers className="mr-1" />
            <span className="font-semibold mr-1">{ticketsSold}</span>
            asistentes
          </div>
          <div className="flex items-center font-medium">
            L.{(event.revenue || 0).toLocaleString()}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t flex space-x-2">
          <Link href={`/event/${event._id}/edit`} className="flex-1">
            <button className="w-full py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">
              Gestionar
            </button>
          </Link>
          <Link href={`/event/${event._id}`} className="flex-1">
            <button className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
              Ver detalles
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
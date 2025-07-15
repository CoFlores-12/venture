import { FiCalendar, FiUsers } from 'react-icons/fi';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md w-full max-w-full">
      <div className="h-48 relative">
        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {event.status === 'active' ? 'Activo' : 'Finalizado'}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-1 text-gray-800">{event.name}</h3>
        <p className="text-gray-500 mb-3 flex items-center">
          <FiCalendar className="mr-2" />
          {new Date(event.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <FiUsers className="mr-1" />
            {event.attendees} asistentes
          </div>
          <div className="flex items-center font-medium">
            L.{event.revenue}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t flex space-x-2">
          <button className="flex-1 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">
            Gestionar
          </button>
          <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
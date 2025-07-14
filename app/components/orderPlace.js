import { useState } from 'react';

const TicketPurchaseModal = ({ event, onClose, onProceedToCheckout }) => {
const [tickets, setTickets] = useState(
  event?.tickets?.map(ticket => ({
    ...ticket,
    quantityOrder: 1
  })) || []
);

  

  const handleQuantityChange = (type, value) => {
    const newValue = Math.max(0, parseInt(value)) || 0;
    setTickets({
      ...tickets,
      [type]: {
        ...tickets[type],
        quantityOrder: newValue
      }
    });
  };

  const calculateTotal = () => {
    return Object.values(tickets).reduce(
      (total, ticket) => total + (ticket.quantityOrder * ticket.price),
      0
    );
  };

  const handleProceed = () => {
    const ticketData = Object.entries(tickets)
      .filter(([_, data]) => data.quantity > 0)
      .map(([type, data]) => ({
        name: data.name,
        quantity: data.quantityOrder,
        price: data.price
      }));

    onProceedToCheckout(ticketData);
  };

  const hasTicketsSelected = Object.values(tickets).some(ticket => ticket.quantity > 0);

  return (
    <div className="fixed inset-0 bg-[#897f7f30] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Selecciona tus boletos</h2>
        
        <div className="space-y-4 mb-6">
          {Object.entries(tickets).map(([type, data]) => (
            <div key={type} className="flex justify-between items-center ">
              <div>
                <h4 className="font-medium capitalize">{data.name} - L.{data.price}</h4>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleQuantityChange(type, data.quantityOrder - 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  -
                </button>
                <span className="mx-4 w-8 text-center">{data.quantityOrder}</span>
                <button 
                  onClick={() => handleQuantityChange(type, data.quantityOrder + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>L.{calculateTotal()}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={handleProceed}
            disabled={!hasTicketsSelected}
            className={`px-4 py-2 rounded-lg font-medium text-white ${hasTicketsSelected ? 'bg-gradient-to-r from-purple-600 to-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
};

const ComprarBoletosModal = ({ event }) => {
  const [showModal, setShowModal] = useState(false);

  const handleProceedToCheckout = (ticketData) => {
    const params = new URLSearchParams();
    params.append('eventId', event._id);
    params.append('eventName', event.title);
    
    ticketData.forEach(ticket => {
      params.append(`tickets[${ticket.name}][quantity]`, ticket.quantity);
      params.append(`tickets[${ticket.name}][price]`, ticket.price);
    });

    window.location.href = `/checkout?${params.toString()}`;
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
      >
        Comprar boletos - Desde L.{event.price}
      </button>

      {showModal && (
        <TicketPurchaseModal 
          event={event}
          onClose={() => setShowModal(false)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}
    </>
  );
};

export default ComprarBoletosModal;
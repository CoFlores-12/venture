"use client"
import React, { useState, useEffect } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { FaCreditCard, FaPaypal, FaMoneyBillWave, FaQrcode, FaShieldAlt, FaLock, FaUserShield } from 'react-icons/fa';
import { useAuthUser } from '@/src/lib/authUsers';
import { useRouter } from 'next/navigation';

const PaymentGateway = () => {
  const { user, loading2 } = useAuthUser();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('card'); 
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ticketDetails, setTicketDetails] = useState(null);
  let totalBoletos = 0;
  let totalPrecio = 0;

  useEffect(()=>{
    const searchParams = new URLSearchParams(location.search);
    const eventId = searchParams.get('eventId');
    const eventName = searchParams.get('eventName');
    const tickets = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith('tickets[')) {
        const match = key.match(/tickets\[(.*?)\]\[(.*?)\]/);
        if (match) {
          const type = match[1];
          const property = match[2];
          
          let ticket = tickets.find(t => t.type === type);
          if (!ticket) {
            ticket = { type };
            tickets.push(ticket);
          }
          ticket[property] = property === 'price' ? parseFloat(value) : parseInt(value);
        }
      }
    });
    tickets.forEach(ticket => {
      const cantidad = ticket.quantity || 0;
      totalBoletos += cantidad;
    });


    const total = tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);

    setTicketDetails({
      eventId,
      eventName,
      tickets,
      total
    });

    setLoading(false);
  },[])


  const handleCardChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s?/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    if (name === 'expiry') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .slice(0, 5);
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    
    try {
      let purchaseSuccess = 0;
      
      const promises = ticketDetails.tickets.map(async (ticket) => {
        const res = await fetch("/api/purchase", {
          method: "POST",
          body: JSON.stringify({
            event: ticketDetails.eventId,
            ticketQuantity: ticket.quantity,
            typeTicket: ticket.type
          })
        });

        const data = await res.json(); 

        purchaseSuccess++;
        let purchaseSaved = JSON.parse(localStorage.getItem("purchase"));
        if (!Array.isArray(purchaseSaved)) {
          purchaseSaved = [];
        }
        purchaseSaved.push(data.returnPurchase);
        localStorage.setItem('purchase', JSON.stringify(purchaseSaved));

        return data;
      });

      Promise.all(promises).then(() => {
        setPaymentStatus('success');
      });

    } catch (error) {
      console.error('Error en el pago:', error);
      setPaymentStatus('failed');
      setIsProcessing(false);
    }
  };

  const paypalOptions = {
    clientId: "AU9j_rS1FjnhR_att4dsYCYVV_RszLj_dxrK3sLFQzyQ1eDaa5iJ64LG7Gq0QktIGWh9mN_LbaHh4HmR", 
    currency: "USD",
    intent: "capture",
  };

 const createPayPalOrder = async (data, actions) => {
  const totalHNL = ticketDetails?.tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);

  const res = await fetch('https://open.er-api.com/v6/latest/HNL');
  const dataApi = await res.json();

  if (dataApi.result !== 'success') {
    throw new Error("No se pudo obtener la tasa de cambio");
  }

  const tasa = dataApi.rates.USD;

  const totalUSD = (totalHNL * tasa).toFixed(2);
  const unitUSD = (totalHNL * tasa).toFixed(2);

  return actions.order.create({
    purchase_units: [{
      amount: {
        value: totalUSD,
        currency_code: "USD",
        breakdown: {
          item_total: {
            value: totalUSD,
            currency_code: "USD"
          }
        }
      },
      items: [{
        name: `${totalBoletos} Boletos - ${ticketDetails.eventName}`,
        unit_amount: {
          value: unitUSD,
          currency_code: "USD"
        },
        quantity: 1,
        description: "Entrada para evento"
      }]
    }],
    application_context: {
      shipping_preference: "NO_SHIPPING"
    }
  });
};


  const onPayPalApprove = (data, actions) => {
    return actions.order.capture().then(details => {
      setPaymentStatus('success');
      
      const purchaseData = {
        ...ticketDetails,
        ...user,
        paymentMethod: 'paypal',
        transactionId: details.id,
        purchaseDate: new Date().toISOString(),
        payer: details.payer
      };
      
      //TODO: send to API
      localStorage.setItem('recentPurchase', JSON.stringify(purchaseData));
      return details;
    });
  };

  const onPayPalError = (err) => {
    console.error("PayPal error:", err);
    setPaymentStatus('failed');
    setIsProcessing(false);
  };

  const totalAmount = ticketDetails?.tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);

   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Cargando información de pago...</p>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
        {/* Back Button */}
        <button
          onClick={() => {
            if (ticketDetails?.eventId) {
              router.push(`/event/${ticketDetails.eventId}`);
            } else {
              router.back();
            }
          }}
          className="mb-6 flex items-center text-purple-700 hover:text-purple-900 font-medium"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          Volver al evento
        </button>
        <div className="max-w-4xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Finaliza tu compra</h1>
            <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 max-w-lg mx-auto">
              Completa tu información de pago de forma segura para adquirir tus entradas
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resumen de la compra */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 h-fit border border-purple-100 text-purple-600">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Resumen de compra</h2>
                <div className="flex items-center text-sm text-purple-700">
                  <FaShieldAlt className="mr-1" />
                  <span>Seguro</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Evento:</span>
                  <span className="font-medium">{ticketDetails.eventName}</span>
                </div>
                
                <div className="space-y-4 mb-6">
            {ticketDetails.tickets.map((ticket, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <p className="font-medium capitalize">{ticket.type}</p>
                  <p className="text-gray-600">{ticket.quantity} x L.{ticket.price.toFixed(2)}</p>
                </div>
                <p className="font-medium">L.{(ticket.quantity * ticket.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
                
                <div className="border-t pt-4 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-purple-700">L {totalAmount.toFixed(2)}</span>
                  </div>
                  
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">Información del comprador</h3>
                <p className="text-gray-800">{user?.name}</p>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>
            </div>
            
            {/* Pasarela de pago */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
              {paymentStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mb-3">¡Pago Completado!</h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Tu compra ha sido procesada exitosamente. Hemos enviado los detalles a tu correo electrónico.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-5 max-w-md mx-auto mb-6">
                  </div>
                  <a 
                    href='/mis-compras'
                    className="bg-purple-700 text-white py-3 px-8 rounded-full hover:bg-purple-800 transition font-medium shadow-lg"
                  >
                    Ver mis entradas
                  </a>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Método de pago</h2>
                    
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
                      <button 
                        onClick={() => setSelectedMethod('card')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedMethod === 'card' 
                            ? 'border-purple-600 bg-purple-50 shadow-sm' 
                            : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        <FaCreditCard className="text-2xl text-purple-700 mb-2" />
                        <span className="text-sm font-medium text-purple-600">Tarjeta</span>
                      </button>
                      
                      <button 
                        onClick={() => setSelectedMethod('paypal')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedMethod === 'paypal' 
                            ? 'border-purple-600 bg-purple-50 shadow-sm' 
                            : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        <FaPaypal className="text-2xl text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-purple-600">PayPal</span>
                      </button>
                      
                      
                      <button 
                        onClick={() => setSelectedMethod('cash')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedMethod === 'cash' 
                            ? 'border-purple-600 bg-purple-50 shadow-sm' 
                            : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        <FaMoneyBillWave className="text-2xl text-green-600 mb-2" />
                        <span className="text-sm font-medium text-purple-600">Efectivo</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6">
                    {/* Método: Tarjeta */}
                    {selectedMethod === 'card' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pago con Tarjeta</h3>
                          
                          <div className="space-y-5">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre en la tarjeta
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={cardDetails.name}
                                onChange={handleCardChange}
                                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent text-purple-700"
                                placeholder="Ej: María Rodríguez"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número de tarjeta
                              </label>
                              <input
                                type="text"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleCardChange}
                                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent text-purple-700"
                                placeholder="0000 0000 0000 0000"
                                required
                              />
                              <div className="flex mt-3 space-x-3">
                                <div className="h-8 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                                  <FaCreditCard className="text-gray-600" />
                                </div>
                                <div className="h-8 w-12 bg-blue-900 rounded-md flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">VISA</span>
                                </div>
                                <div className="h-8 w-12 bg-orange-600 rounded-md flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">MC</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Fecha de expiración
                                </label>
                                <input
                                  type="text"
                                  name="expiry"
                                  value={cardDetails.expiry}
                                  onChange={handleCardChange}
                                  className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent text-purple-700"
                                  placeholder="MM/AA"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Código de seguridad (CVV)
                                </label>
                                <input
                                  type="text"
                                  name="cvc"
                                  value={cardDetails.cvc}
                                  onChange={handleCardChange}
                                  className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent text-purple-700"
                                  placeholder="123"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-100">
                          <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full bg-purple-700 text-white py-4 rounded-xl hover:bg-purple-800 transition font-bold text-lg flex items-center justify-center disabled:opacity-70"
                          >
                            {isProcessing ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando pago...
                              </>
                            ) : (
                              `Pagar L ${totalAmount.toFixed(2)}`
                            )}
                          </button>
                          
                          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                            <FaShieldAlt className="mr-2 text-purple-600" />
                            <span>Protegido con encriptación SSL de 256-bit</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Método: PayPal */}
                    {selectedMethod === 'paypal' && (
                      <div className="py-4">
                        <div className="bg-blue-50 rounded-xl p-5 mb-6">
                          <div className="flex items-center mb-3">
                            <FaPaypal className="text-2xl text-blue-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Pago con PayPal</h3>
                          </div>
                          <p className="text-gray-600 mb-4">
                            Paga de forma segura con tu cuenta PayPal. Serás redirigido a PayPal para completar tu pago.
                          </p>
                          <div className="flex items-center text-blue-600">
                            <FaUserShield className="mr-2" />
                            <span className="text-sm">Protegido por la garantía de PayPal</span>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <PayPalButtons
                            createOrder={createPayPalOrder}
                            onApprove={onPayPalApprove}
                            onError={onPayPalError}
                            style={{
                              layout: 'vertical',
                              color: 'blue',
                              shape: 'rect',
                              label: 'pay',
                              height: 48
                            }}
                            disabled={isProcessing}
                          />
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <FaLock className="mr-2 text-green-600" />
                          <span>PayPal encripta tus datos financieros con tecnología avanzada</span>
                        </div>
                      </div>
                    )}
                    
                    
                    
                    {/* Método: Efectivo */}
                    {selectedMethod === 'cash' && (
                      <div className="py-4">
                        <div className="bg-green-50 rounded-xl p-5 mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Pago en Efectivo</h3>
                          <p className="text-gray-600 mb-4">
                            Puedes pagar en efectivo en cualquiera de nuestras sucursales asociadas.
                          </p>
                          <div className="flex items-center text-green-600">
                            <FaShieldAlt className="mr-2" />
                            <span className="text-sm">Sin comisiones adicionales</span>
                          </div>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Opciones disponibles:</h4>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>BAC Credomatic</li>
                              <li>Banco Ficohsa</li>
                              <li>Banco Atlántida</li>
                              <li>Tiendas asociadas (Supermercados, farmacias)</li>
                            </ul>
                          </div>
                          
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-yellow-700 font-medium">
                              Tu reserva será válida por 48 horas para que realices el pago
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <button 
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="bg-green-600 text-white py-3.5 px-8 rounded-full hover:bg-green-700 transition font-medium disabled:opacity-70"
                          >
                            {isProcessing ? 'Procesando...' : 'Reservar entradas'}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {paymentStatus === 'failed' && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        <p>Hubo un problema con tu pago. Por favor intenta nuevamente o elige otro método de pago.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Información de seguridad */}
          <div className="mt-10 bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tu seguridad es nuestra prioridad</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <FaShieldAlt className="text-purple-700 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Encriptación avanzada</h4>
                  <p className="text-gray-600 text-sm">
                    Todos los datos se transmiten con cifrado SSL de 256-bit, el mismo que usan los bancos.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <FaLock className="text-purple-700 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Cumplimiento PCI DSS</h4>
                  <p className="text-gray-600 text-sm">
                    Cumplimos con los estándares de seguridad de la industria de tarjetas de pago.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <FaUserShield className="text-purple-700 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Protección de compra</h4>
                  <p className="text-gray-600 text-sm">
                    Garantizamos la protección de tu compra y tus datos personales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PaymentGateway;
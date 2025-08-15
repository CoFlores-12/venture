import React, { useState } from 'react';

const EventPlanSelector = ({ onPlanSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Evento Básico',
      price: 'Gratis',
      description: 'Perfecto para eventos pequeños y sencillos',
      tickets: 1,
      persons: 50,
      features: [
        'Máximo 50 personas',
        '1 tipo de boleto',
        'Soporte básico por correo',
        'Panel de administración simple'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Evento Premium',
      price: 'L.50',
      description: 'Ideal para eventos con múltiples opciones',
      tickets: 3,
      persons: 1000,
      features: [
        'Máximo 1,000 personas',
        '3 tipos de boletos',
        'Soporte prioritario',
        'Panel de administración avanzado',
        'Personalización básica'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Evento Pro',
      price: 'L.100',
      tickets: 5,
      persons: 10000,
      description: 'Para grandes eventos profesionales',
      features: [
        'Máximo 10,000 personas',
        '5 tipos de boletos',
        'Soporte 24/7',
        'Panel de administración completo',
        'Analíticas detalladas',
      ],
      popular: false
    }
  ];

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    if (onPlanSelect) {
      onPlanSelect(plans.find(plan => plan.id === planId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold  sm:text-4xl">
          Elige el plan perfecto para tu evento
        </h2>
        <p className="mt-4 text-xl  opacity-75">
          Selecciona la opción que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 
              ${selectedPlan === plan.id ? 'ring-4 ring-purple-800 transform scale-105' : 'ring-1 ring-gray-200'}
              ${plan.popular ? 'border-t-4 border-purple-800' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-purple-800  px-3 py-1 text-xs font-bold rounded-bl-lg">
                MÁS POPULAR
              </div>
            )}
            
            <div className="px-6 py-8 bg-white dark:bg-slate-800 dark:text-gray-300">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:bg-slate-800 dark:text-gray-300">{plan.name}</h3>
              </div>
                <span className={`text-3xl font-bold ${plan.id === 'basic' ? 'text-gray-900 dark:bg-slate-800 dark:text-gray-300' : 'text-purple-800'}`}>
                  {plan.price}
                </span>
              <p className="mt-2  opacity-80">{plan.description}</p>
              
              <div className="mt-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      
                      <span className="ml-3 ">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800 dark:text-gray-300">
              <button
                type='button'
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 px-4 rounded-md font-medium 
                  ${selectedPlan === plan.id 
                    ? 'bg-purple-800  hover:bg-purple-900' 
                    : 'bg-white text-purple-800 border border-purple-800  dark:bg-slate-900 dark:text-gray-300'}
                  transition-colors duration-300`}
              >
                {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar plan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPlanSelector;
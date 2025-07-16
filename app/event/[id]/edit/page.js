"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FiCalendar, FiMapPin, FiTag, FiX, FiPlus, FiTrash2, FiImage } from 'react-icons/fi';
import EventPlanSelector from '@/app/components/PlanEvent';
import { LuTicketCheck } from 'react-icons/lu';

const MapWithNoSSR = dynamic(
  () => import('../../../components/Leafletmap'),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">Cargando mapa...</div>
  }
);

const categories = [
  '🎵 Música',
  '🎭 Teatro',
  '🖼️ Arte',
  '🍽️ Gastronomía',
  '⚽ Deportes',
  '📚 Literatura',
  '🎤 Concierto',
  '💃 Baile',
  '🎪 Festival',
  '🎮 Gaming',
  '📸 Fotografía',
  '🎬 Cine',
  '🎨 Taller Creativo',
  '🧘 Bienestar',
  '👨‍💻 Tecnología',
  '🌱 Sustentabilidad',
  '🎭 Stand-up',
  '🍷 Degustación',
  '🛍️ Mercado',
  '👶 Familiar',
  '🎓 Educativo',
  '✈️ Viajes',
  '🐶 Mascotas',
  '🎳 Bowling',
  '♟️ Juegos de Mesa',
  '🍻 Happy Hour',
  '🎄 Navideño',
  '🎆 Año Nuevo',
  '💘 San Valentín',
  '🎃 Halloween'
];

const EventEditForm = () => {
  const router = useRouter();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(null);
  const [planSeleted, setPlanSelected] = useState({});

  useEffect(() => {
    fetch(`/api/event/${id}`)
      .then(res => res.json())
      .then(event => {
        setFormData({
          ...event,
          banner: null, // For new upload
          bannerPreview: event.banner,
          tickets: event.tickets.map(ticket => ({
            ...ticket,
            id: ticket._id || Date.now() + Math.random()
          })),
        });
        setPlanSelected({ id: event.plan });
      });
  }, [id]);

  const handlePlanSelect = (selectedPlan) => {
    setPlanSelected(selectedPlan);
    setFormData(prev => ({
      ...prev,
      plan: selectedPlan.id,
      tickets: prev.tickets.slice(0, selectedPlan.tickets)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          banner: file,
          bannerPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      banner: null,
      bannerPreview: ''
    }));
  };

  const handleMapClick = (latlng) => {
    setFormData(prev => ({
      ...prev,
      position: [latlng.lat, latlng.lng]
    }));
  };

  const handleTicketChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      tickets: prev.tickets.map(ticket =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const addTicket = () => {
    setFormData(prev => ({
      ...prev,
      tickets: [
        ...prev.tickets,
        { id: Date.now(), type: '', price: '', quantity: '' }
      ]
    }));
  };

  const removeTicket = (id) => {
    if (formData.tickets.length > 1) {
      setFormData(prev => ({
        ...prev,
        tickets: prev.tickets.filter(ticket => ticket.id !== id)
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description?.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.date) newErrors.date = 'La fecha es requerida';
    if (!formData.startTime) newErrors.startTime = 'La hora de inicio es requerida';
    if (!formData.endTime) newErrors.endTime = 'La hora de fin es requerida';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    formData.tickets.forEach((ticket, index) => {
      if (!ticket.type?.trim()) newErrors[`ticketType${index}`] = 'Tipo de ticket requerido';
      if (!ticket.price) newErrors[`ticketPrice${index}`] = 'Precio requerido';
      if (isNaN(ticket.price)) newErrors[`ticketPrice${index}`] = 'Precio debe ser número';
      if (ticket.quantity && isNaN(ticket.quantity)) newErrors[`ticketQuantity${index}`] = 'Cantidad debe ser número';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const eventData = {
        ...formData,
        bannerPreview: formData.bannerPreview?.startsWith('data:image')
          ? formData.bannerPreview.replace(/^data:image\/[a-z]+;base64,/, '')
          : undefined,
        emoji: formData.category?.charAt(0),
        time: `${formData.startTime} - ${formData.endTime}`,
        location: formData.location,
        tickets: formData.tickets.map(ticket => ({
          name: ticket.type,
          price: Number(ticket.price),
          quantityAvailable: ticket.quantity ? Number(ticket.quantity) : null,
          quantity: ticket.quantity ? Number(ticket.quantity) : null
        }))
      };
      await fetch(`/api/event/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      setIsSubmitting(false);
      router.replace(`/event/${id}`);
    } catch (error) {
      setIsSubmitting(false);
      alert('Error al actualizar el evento');
    }
  };

  if (!formData) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-purple-700">Editar evento</h1>
        <button 
          onClick={() => router.back()}
          className="btn btn-ghost btn-circle"
        >
          <FiX className="text-xl" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner del evento */}
        <div>
          <label className="block text-sm font-medium mb-2">Imagen del evento</label>
          {formData.bannerPreview ? (
            <div className="relative group">
              <img 
                src={formData.bannerPreview} 
                alt="Vista previa del banner" 
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 btn btn-circle btn-sm btn-error group-hover:opacity-100 transition-opacity"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-800 dark:text-gray-300  transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiImage className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Sube una imagen para tu evento</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
        {/* Título y descripción */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Título del evento
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                placeholder="Ej: Festival de Música Electrónica"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error">{errors.title}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
                className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
                placeholder="Describe tu evento en detalle..."
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-error">{errors.description}</p>
              )}
            </div>
          </div>
        </div>
        {/* Mapa para selección de ubicación */}
        <div>
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <FiMapPin className="mr-2" /> Ubicación del evento
            </label>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Nombre del lugar
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.location ? 'input-error' : ''}`}
                placeholder="Ej: Parque Central"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-error">{errors.location}</p>
              )}
            </div>
          </div>
          <div className="h-64 rounded-lg overflow-hidden shadow-md border border-gray-200">
            <MapWithNoSSR 
              position={formData.position} 
              onMapClick={handleMapClick} 
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Coordenadas seleccionadas: {formData.position[0].toFixed(4)}, {formData.position[1].toFixed(4)}
          </p>
        </div>
        {/* Fecha y horario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2 flex items-center">
              <FiCalendar className="mr-2" /> Fecha
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date || ""}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.date ? 'input-error' : ''}`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-error">{errors.date}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium mb-2">
                Hora inicio
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime || ""}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.startTime ? 'input-error' : ''}`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-error">{errors.startTime}</p>
              )}
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium mb-2">
                Hora fin
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime || ""}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.endTime ? 'input-error' : ''}`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-error">{errors.endTime}</p>
              )}
            </div>
          </div>
        </div>
        {/* Categoría */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2 flex items-center">
            <FiTag className="mr-2" /> Categoría
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className={`select select-bordered w-full ${errors.category ? 'select-error' : ''}`}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-error">{errors.category}</p>
            )}
          </div>
        </div>
        <EventPlanSelector onPlanSelect={handlePlanSelect} />
        {/* Tickets */}
        { planSeleted?.id && (
          <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <LuTicketCheck className="mr-2" /> Tipos de Entradas
            </h3>
            {
              planSeleted?.tickets > formData.tickets.length && (
                <button 
                  type="button"
                  onClick={addTicket}
                  className="btn btn-sm btn-ghost text-purple-700"
                >
                  <FiPlus className="mr-1" /> Agregar
                </button>
              )
            }
          </div>
          <div className="space-y-4">
            {formData.tickets.map((ticket, index) => (
              <div key={ticket.id} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <input
                    type="text"
                    value={ticket.type || ""}
                    onChange={e => handleTicketChange(ticket.id, 'type', e.target.value)}
                    className={`input input-bordered w-full ${errors[`ticketType${index}`] ? 'input-error' : ''}`}
                    placeholder="Ej: General, VIP"
                  />
                  {errors[`ticketType${index}`] && (
                    <p className="mt-1 text-sm text-error">{errors[`ticketType${index}`]}</p>
                  )}
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-2">Precio (L.)</label>
                  <input
                    type="text"
                    value={ticket.price || ""}
                    onChange={e => handleTicketChange(ticket.id, 'price', e.target.value)}
                    className={`input input-bordered w-full ${errors[`ticketPrice${index}`] ? 'input-error' : ''}`}
                    placeholder="450"
                  />
                  {errors[`ticketPrice${index}`] && (
                    <p className="mt-1 text-sm text-error">{errors[`ticketPrice${index}`]}</p>
                  )}
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-2">Cantidad (opcional)</label>
                  <input
                    type="text"
                    value={ticket.quantity || ""}
                    onChange={e => handleTicketChange(ticket.id, 'quantity', e.target.value)}
                    className={`input input-bordered w-full ${errors[`ticketQuantity${index}`] ? 'input-error' : ''}`}
                    placeholder="Ilimitado si vacío"
                  />
                  {errors[`ticketQuantity${index}`] && (
                    <p className="mt-1 text-sm text-error">{errors[`ticketQuantity${index}`]}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeTicket(ticket.id)}
                    className="btn btn-square btn-sm btn-ghost text-error"
                    disabled={formData.tickets.length <= 1}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            className={`btn btn-primary w-full bg-purple-700 hover:bg-purple-800 text-white ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando cambios...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventEditForm; 
"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiFileText, FiPhone, FiHome, FiUpload, FiCheck, FiX } from 'react-icons/fi'

const VerifyOrganizerForm = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    documentType: 'ID',
    documentNumber: '',
    phone: '',
    address: '',
    documentImage: null,
    documentPreview: '',
    organizationDesc: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          documentImage: file,
          documentPreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      documentImage: null,
      documentPreview: ''
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.organizationName.trim()) newErrors.organizationName = 'Nombre de organización requerido'
    if (!formData.organizationDesc.trim()) newErrors.organizationDesc = 'Descripción de organización requerido'
    if (!formData.documentNumber) newErrors.documentNumber = 'Número de documento requerido'
    if (!formData.phone) newErrors.phone = 'Teléfono requerido'
    if (!formData.address) newErrors.address = 'Dirección requerida'
    if (!formData.documentImage) newErrors.documentImage = 'Imagen del documento requerida'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/users/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: formData.organizationName,
          documentType: formData.documentType,
          documentNumber: formData.documentNumber,
          phone: formData.phone,
          address: formData.address,
          organizationDesc: formData.organizationDesc,
          documentImageBase64: formData.documentPreview.replace(/^data:image\/[a-z]+;base64,/, '')
        }),
      });

      if (res?.ok) {
        setVerificationStatus('success')
      }else {
        const data = await res.json();
        alert(data.message)
      }

      
    } catch (error) {
      setVerificationStatus('error')
      setErrors({ general: 'Error al enviar la solicitud' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (verificationStatus === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FiCheck className="text-green-600 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h2>
        <p className="text-gray-600 mb-6">
          Tu solicitud para ser organizador ha sido recibida. Nuestro equipo revisará tu 
          información y te notificará por correo electrónico en un plazo de 24-48 horas.
        </p>
        <button
          onClick={() => router.push('/home')}
          className="btn btn-primary bg-purple-700 hover:bg-purple-800 text-white"
        >
          Ir al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-purple-700">Verificación de Organizador</h2>
          <p className="text-gray-600">
            Completa la información para crear eventos en Venture
          </p>
        </div>
        <button 
          onClick={() => router.push('/home')}
          className="btn btn-ghost"
        >
          <FiX className="text-xl" />
        </button>
      </div>

      {errors.general && (
        <div className="alert alert-error mb-4">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre de la organización */}
        <div>
          <label className="block text-sm font-medium mb-1">Nombre de la organización</label>
          <div className="relative">
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className={`input input-bordered w-full ${errors.organizationName ? 'input-error' : ''}`}
              placeholder="Ej: Cultura Tegus"
            />
          </div>
          {errors.organizationName && <p className="mt-1 text-sm text-error">{errors.organizationName}</p>}
        </div>

        {/* Descripción de la organización */}
        <div>
          <label className="block text-sm font-medium mb-1">Descripción de la organización</label>
          <div className="relative">
            <input
              type="text"
              name="organizationDesc"
              value={formData.organizationDesc}
              onChange={handleChange}
              className={`input input-bordered w-full ${errors.organizationDesc ? 'input-error' : ''}`}
              placeholder="Ej: Conciertos masivos en tu ciudad"
            />
          </div>
          {errors.organizationName && <p className="mt-1 text-sm text-error">{errors.organizationName}</p>}
        </div>

        {/* Tipo de documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="ID">Cédula de Identidad</option>
              <option value="RTN">RTN</option>
              <option value="passport">Pasaporte</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Número de Documento</label>
            <div className="relative">
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.documentNumber ? 'input-error' : ''}`}
                placeholder="Ej: 0801-1990-12345"
              />
              <FiFileText className="absolute right-3 top-3 text-gray-400" />
            </div>
            {errors.documentNumber && <p className="mt-1 text-sm text-error">{errors.documentNumber}</p>}
          </div>
        </div>

        {/* Teléfono y Dirección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                placeholder="Ej: +504 9123-4567"
              />
              <FiPhone className="absolute right-3 top-3 text-gray-400" />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.address ? 'input-error' : ''}`}
                placeholder="Dirección completa"
              />
              <FiHome className="absolute right-3 top-3 text-gray-400" />
            </div>
            {errors.address && <p className="mt-1 text-sm text-error">{errors.address}</p>}
          </div>
        </div>

        {/* Imagen del documento */}
        <div>
          <label className="block text-sm font-medium mb-1">Documento de identificación</label>
          <p className="text-gray-500 text-sm mb-2">Sube una foto clara de tu documento (frontal). Asegúrate de que todos los datos sean legibles.</p>
          
          {formData.documentPreview ? (
            <div className="relative group">
              <img 
                src={formData.documentPreview} 
                alt="Vista previa del documento" 
                className="w-full max-w-xs object-contain border rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Haz clic para subir una imagen</p>
                <p className="text-xs text-gray-400 mt-1">Formatos: JPG, PNG (máx. 5MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
          {errors.documentImage && <p className="mt-1 text-sm text-error">{errors.documentImage}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="btn btn-primary w-full bg-purple-700 hover:bg-purple-800 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando solicitud...' : 'Solicitar verificación'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VerifyOrganizerForm
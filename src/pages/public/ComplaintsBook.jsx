import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../utils/apiClient';
import { BookOpen, CheckCircle2, AlertCircle, Send, ShieldCheck, ArrowLeft, FileText } from 'lucide-react';

export default function ComplaintsBook() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    documentType: 'DNI',
    documentNumber: '',
    phone: '',
    complaintType: 'RECLAMO',
    serviceType: 'Servicio de Hospedaje',
    detail: '',
    consumerRequest: '',
    acceptedTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.acceptedTerms) {
      setError('Debes declarar que los datos consignados son verdaderos para continuar.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient('/complaints', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          documentType: formData.documentType,
          documentNumber: formData.documentNumber,
          phone: formData.phone,
          complaintType: formData.complaintType,
          serviceType: formData.serviceType,
          detail: formData.detail,
          consumerRequest: formData.consumerRequest
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al registrar la reclamación. Por favor, verifica tus datos.');
      }

      const data = await response.json();
      setSubmittedData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({
      fullName: '',
      email: user?.email || '',
      documentType: 'DNI',
      documentNumber: '',
      phone: '',
      complaintType: 'RECLAMO',
      serviceType: 'Servicio de Hospedaje',
      detail: '',
      consumerRequest: '',
      acceptedTerms: false
    });
    setError('');
  };

  if (submittedData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#eca8d6]/10 rounded-full blur-3xl -z-10" />

          <div className="w-16 h-16 bg-[#eca8d6]/20 border border-[#eca8d6]/40 rounded-2xl flex items-center justify-center mb-6 text-[#eca8d6]">
            <CheckCircle2 size={36} />
          </div>

          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#eca8d6]/15 text-[#eca8d6] border border-[#eca8d6]/30 mb-3">
            HOJA DE RECLAMACIÓN N° REC-{submittedData.id}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Reclamación Registrada con Éxito</h1>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Conforme a lo regulado por el Código de Protección y Defensa del Consumidor (Ley N° 29571), su{' '}
            <strong className="text-white font-medium">{submittedData.complaintType}</strong> ha sido ingresado en nuestro Libro de Reclamaciones Virtual.
          </p>

          <div className="bg-[#181818] border border-white/5 rounded-xl p-5 space-y-3 text-sm mb-6">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40">Consumidor:</span>
              <span className="text-white font-medium">{submittedData.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40">Correo de respuesta:</span>
              <span className="text-[#eca8d6] font-medium">{submittedData.email}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40">Documento:</span>
              <span className="text-white font-medium">{submittedData.documentType} {submittedData.documentNumber}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40">Bien contratado:</span>
              <span className="text-white font-medium">{submittedData.serviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Fecha de presentación:</span>
              <span className="text-white font-medium">{new Date(submittedData.createdAt || Date.now()).toLocaleString('es-PE')}</span>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-xl p-4 text-xs leading-relaxed mb-8">
            <p>
              ℹ️ De conformidad con las disposiciones de INDECOPI, la respuesta motivada a su reclamación le será remitida directamente al correo{' '}
              <strong className="text-white">{submittedData.email}</strong> en un plazo máximo no mayor a <strong>quince (15) días hábiles</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              className="flex-1 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors border border-white/10 text-center"
            >
              Registrar otra reclamación
            </button>
            <Link
              to="/"
              className="flex-1 px-5 py-3 rounded-xl bg-[#eca8d6] hover:bg-white text-black font-semibold text-sm transition-colors text-center"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 text-sm transition-colors">
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      {/* Header Institucional */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#eca8d6]/20 border border-[#eca8d6]/40 flex items-center justify-center text-[#eca8d6] flex-shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Libro de Reclamaciones Virtual</h1>
            <p className="text-white/60 text-sm mt-1">
              Conforme a lo establecido en el Código de Protección y Defensa del Consumidor — Ley N° 29571
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3 mb-6">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Paso 1: Tipo de Reclamación */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#eca8d6] text-black text-xs font-extrabold flex items-center justify-center">1</span>
            Tipo de Reclamación
          </h2>
          <p className="text-white/50 text-xs mb-5">Selecciona el tipo de proceso que deseas registrar según tu caso:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between ${
                formData.complaintType === 'RECLAMO'
                  ? 'border-[#eca8d6] bg-[#eca8d6]/10'
                  : 'border-white/10 bg-[#161616] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <input
                    type="radio"
                    name="complaintType"
                    value="RECLAMO"
                    checked={formData.complaintType === 'RECLAMO'}
                    onChange={handleChange}
                    className="accent-[#eca8d6]"
                  />
                  RECLAMO
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Producto / Servicio
                </span>
              </div>
              <p className="text-white/60 text-xs">
                Disconformidad relacionada directamente a los productos adquiridos o servicios brindados por el hotel.
              </p>
            </label>

            <label
              className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between ${
                formData.complaintType === 'QUEJA'
                  ? 'border-[#eca8d6] bg-[#eca8d6]/10'
                  : 'border-white/10 bg-[#161616] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <input
                    type="radio"
                    name="complaintType"
                    value="QUEJA"
                    checked={formData.complaintType === 'QUEJA'}
                    onChange={handleChange}
                    className="accent-[#eca8d6]"
                  />
                  QUEJA
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Atención al Público
                </span>
              </div>
              <p className="text-white/60 text-xs">
                Malestar o descontento respecto a la atención recibida por parte de nuestro personal o trato recibido.
              </p>
            </label>
          </div>
        </div>

        {/* Paso 2: Identificación del Consumidor Reclamante */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#eca8d6] text-black text-xs font-extrabold flex items-center justify-center">2</span>
            Identificación del Consumidor Reclamante
          </h2>
          <p className="text-white/50 text-xs mb-4">Ingresa tus datos personales reales para poder dar respuesta y seguimiento formal.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Nombres y Apellidos Completos *</label>
              <input
                type="text"
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ej. Juan Carlos Pérez Rojas"
                className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#eca8d6] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">
                Correo Electrónico (Notificación Obligatoria) *
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#eca8d6] focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-[#eca8d6]/80 mt-1">
                ✉️ A este correo se enviará la copia de la reclamación y la respuesta legal oficial.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Tipo de Documento *</label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:border-[#eca8d6] focus:outline-none transition-colors"
              >
                <option value="DNI">DNI (Documento Nacional)</option>
                <option value="CE">Carné de Extranjería (CE)</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Número de Documento *</label>
              <input
                type="text"
                required
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                placeholder="Ej. 72345678"
                className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#eca8d6] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Teléfono o Celular de Contacto</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej. 987654321"
                className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#eca8d6] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Paso 3: Identificación del Bien Contratado y Detalle */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#eca8d6] text-black text-xs font-extrabold flex items-center justify-center">3</span>
            Detalle de la Reclamación y Pedido
          </h2>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Bien o Servicio Contratado *</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:border-[#eca8d6] focus:outline-none transition-colors"
            >
              <option value="Servicio de Hospedaje">Servicio de Hospedaje (Habitación)</option>
              <option value="Reserva Web">Proceso de Reserva en Línea / Pagos</option>
              <option value="Restaurante y Bar">Restaurante / Bar / Desayuno</option>
              <option value="Servicios Adicionales">Servicios Adicionales (Lavandería, Spa, Transporte)</option>
              <option value="Atención en Recepción">Atención en Recepción / Check-in / Check-out</option>
              <option value="Otro">Otro servicio</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">
              Detalle y Descripción de los Hechos *
            </label>
            <textarea
              required
              rows={4}
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              placeholder="Explica de manera clara y precisa los hechos ocurridos, fechas, número de habitación o reserva si aplica..."
              className="w-full bg-[#161616] border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#eca8d6] focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">
              Pedido Concreto del Consumidor (Solución solicitada)
            </label>
            <textarea
              rows={3}
              name="consumerRequest"
              value={formData.consumerRequest}
              onChange={handleChange}
              placeholder="Indica qué solución o acción esperas por parte de Hotel Gotitas (ej. reembolso, disculpa formal, revisión de cobro, etc.)..."
              className="w-full bg-[#161616] border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#eca8d6] focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Declaración y Envío */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              name="acceptedTerms"
              checked={formData.acceptedTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 accent-[#eca8d6] rounded border-white/20 bg-[#161616]"
            />
            <span className="text-xs text-white/70 leading-relaxed">
              Declaro bajo juramento que los datos personales y los hechos consignados en esta hoja de reclamación son verídicos, y acepto ser notificado por medio de la dirección de correo electrónico brindada.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
            <p className="text-[11px] text-white/40 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#eca8d6]" /> Tu información está protegida por la Ley de Protección de Datos Personales (Ley N° 29733).
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#eca8d6] text-black font-semibold rounded-xl hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#eca8d6]/10"
            >
              {loading ? (
                <>Enviando reclamación...</>
              ) : (
                <>
                  <Send size={16} /> Enviar Reclamación
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

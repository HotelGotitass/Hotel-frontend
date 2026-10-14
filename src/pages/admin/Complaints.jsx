import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { 
  BookOpen, Search, Filter, Mail, CheckCircle2, Clock, 
  Eye, FileText, AlertCircle, RefreshCw, X, User, Phone, Shield
} from 'lucide-react';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await apiClient('/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error('Error al cargar reclamaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (complaint) => {
    const nextStatus = complaint.status === 'PENDING' ? 'RESOLVED' : 'PENDING';
    const confirmMsg = nextStatus === 'RESOLVED'
      ? '¿Marcar esta reclamación como ATENDIDA?'
      : '¿Reabrir esta reclamación como PENDIENTE?';

    if (!window.confirm(confirmMsg)) return;

    setUpdatingId(complaint.id);
    try {
      const res = await apiClient(`/complaints/${complaint.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });

      if (!res.ok) {
        throw new Error('No se pudo actualizar el estado');
      }

      const updated = await res.json();
      setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
      if (selectedComplaint && selectedComplaint.id === updated.id) {
        setSelectedComplaint(updated);
      }
      setFeedbackMsg(`Reclamación #REC-${complaint.id} actualizada a ${nextStatus === 'RESOLVED' ? 'ATENDIDA' : 'PENDIENTE'}.`);
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrado
  const filtered = complaints.filter(item => {
    const matchesSearch = 
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.documentNumber.includes(searchTerm) ||
      item.detail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || item.complaintType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalComplaints = complaints.length;
  const totalReclamos = complaints.filter(c => c.complaintType === 'RECLAMO').length;
  const totalQuejas = complaints.filter(c => c.complaintType === 'QUEJA').length;
  const totalPending = complaints.filter(c => c.status === 'PENDING').length;
  const totalResolved = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BookOpen className="text-[#eca8d6]" size={28} />
            Libro de Reclamaciones
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Registro oficial de quejas y reclamos virtuales ingresados por clientes y usuarios.
          </p>
        </div>
        <button
          onClick={fetchComplaints}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualizar Lista
        </button>
      </div>

      {feedbackMsg && (
        <div className="bg-[#eca8d6]/10 border border-[#eca8d6]/40 text-[#eca8d6] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#111] border border-white/10 rounded-xl p-4">
          <span className="text-xs text-white/50 uppercase font-mono">Total</span>
          <p className="text-2xl font-bold mt-1 text-white">{totalComplaints}</p>
        </div>
        <div className="bg-[#111] border border-purple-500/20 rounded-xl p-4">
          <span className="text-xs text-purple-400 uppercase font-mono">Reclamos</span>
          <p className="text-2xl font-bold mt-1 text-purple-300">{totalReclamos}</p>
        </div>
        <div className="bg-[#111] border border-amber-500/20 rounded-xl p-4">
          <span className="text-xs text-amber-400 uppercase font-mono">Quejas</span>
          <p className="text-2xl font-bold mt-1 text-amber-300">{totalQuejas}</p>
        </div>
        <div className="bg-[#111] border border-yellow-500/20 rounded-xl p-4">
          <span className="text-xs text-yellow-400 uppercase font-mono">Pendientes</span>
          <p className="text-2xl font-bold mt-1 text-yellow-300">{totalPending}</p>
        </div>
        <div className="bg-[#111] border border-green-500/20 rounded-xl p-4">
          <span className="text-xs text-green-400 uppercase font-mono">Atendidos</span>
          <p className="text-2xl font-bold mt-1 text-green-300">{totalResolved}</p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-[#111] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por correo, nombre, DNI o contenido..."
            className="w-full bg-[#161616] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 focus:border-[#eca8d6] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#eca8d6] focus:outline-none"
          >
            <option value="ALL">Todos los Tipos</option>
            <option value="RECLAMO">Reclamos</option>
            <option value="QUEJA">Quejas</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#eca8d6] focus:outline-none"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="RESOLVED">Atendidos</option>
          </select>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#181818] border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-white/70 text-xs">CÓDIGO</th>
                <th className="px-5 py-3.5 font-semibold text-white/70 text-xs">FECHA</th>
                <th className="px-5 py-3.5 font-semibold text-[#eca8d6] text-xs">CORREO DEL USUARIO</th>
                <th className="px-5 py-3.5 font-semibold text-white/70 text-xs">CLIENTE / CONSUMIDOR</th>
                <th className="px-5 py-3.5 font-semibold text-white/70 text-xs">TIPO</th>
                <th className="px-5 py-3.5 font-semibold text-white/70 text-xs">BIEN / SERVICIO</th>
                <th className="px-5 py-3.5 font-semibold text-white/70 text-xs">ESTADO</th>
                <th className="px-5 py-3.5 font-semibold text-white/70 text-xs text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading && complaints.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-white/40">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#eca8d6]" />
                    Cargando reclamaciones...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-white/40">
                    No se encontraron reclamaciones registradas.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Código */}
                    <td className="px-5 py-4 font-mono font-bold text-xs text-white/70">
                      #REC-{item.id}
                    </td>

                    {/* Fecha */}
                    <td className="px-5 py-4 text-xs text-white/50 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    {/* CORREO DEL USUARIO (Destacado explícitamente) */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-[#eca8d6] flex-shrink-0" />
                        <span className="font-semibold text-white bg-[#eca8d6]/10 border border-[#eca8d6]/30 px-2.5 py-1 rounded-md text-xs tracking-wide">
                          {item.email}
                        </span>
                      </div>
                    </td>

                    {/* Cliente */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{item.fullName}</div>
                      <div className="text-[11px] text-white/40 font-mono">
                        {item.documentType}: {item.documentNumber}
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        item.complaintType === 'RECLAMO'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {item.complaintType}
                      </span>
                    </td>

                    {/* Bien o Servicio */}
                    <td className="px-5 py-4 text-xs text-white/70 max-w-[150px] truncate">
                      {item.serviceType}
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        item.status === 'RESOLVED'
                          ? 'bg-green-500/20 text-green-300 border-green-500/40'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                      }`}>
                        {item.status === 'RESOLVED' ? (
                          <>
                            <CheckCircle2 size={12} /> Atendido
                          </>
                        ) : (
                          <>
                            <Clock size={12} /> Pendiente
                          </>
                        )}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedComplaint(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-medium transition-colors flex items-center gap-1.5"
                          title="Ver detalle completo"
                        >
                          <Eye size={14} /> Detalle
                        </button>
                        <button
                          disabled={updatingId === item.id}
                          onClick={() => handleStatusToggle(item)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            item.status === 'PENDING'
                              ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }`}
                        >
                          {updatingId === item.id ? '...' : item.status === 'PENDING' ? 'Resolver' : 'Reabrir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Cabecera del Modal */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#eca8d6]/20 border border-[#eca8d6]/40 flex items-center justify-center text-[#eca8d6]">
                <FileText size={20} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-[#eca8d6]">
                  HOJA DE RECLAMACIÓN #REC-{selectedComplaint.id}
                </span>
                <h2 className="text-xl font-bold text-white">Detalle de Reclamación</h2>
              </div>
            </div>

            <div className="space-y-6 text-sm">
              {/* Bloque: Correo y Cliente */}
              <div className="bg-[#181818] border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40 text-xs">Correo Electrónico (Para respuesta):</span>
                  <a
                    href={`mailto:${selectedComplaint.email}`}
                    className="font-mono text-sm text-[#eca8d6] hover:underline flex items-center gap-1.5"
                  >
                    <Mail size={14} /> {selectedComplaint.email}
                  </a>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40 text-xs">Consumidor Reclamante:</span>
                  <span className="text-white font-medium">{selectedComplaint.fullName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40 text-xs">Documento de Identidad:</span>
                  <span className="text-white font-medium">{selectedComplaint.documentType}: {selectedComplaint.documentNumber}</span>
                </div>
                {selectedComplaint.phone && (
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40 text-xs">Teléfono de Contacto:</span>
                    <span className="text-white font-medium flex items-center gap-1">
                      <Phone size={13} /> {selectedComplaint.phone}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-xs">Fecha de Ingreso:</span>
                  <span className="text-white font-medium">
                    {new Date(selectedComplaint.createdAt).toLocaleString('es-PE')}
                  </span>
                </div>
              </div>

              {/* Bloque: Tipo y Bien */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#181818] border border-white/5 rounded-xl p-3">
                  <span className="text-white/40 text-xs block mb-1">Naturaleza:</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    selectedComplaint.complaintType === 'RECLAMO'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {selectedComplaint.complaintType}
                  </span>
                </div>

                <div className="bg-[#181818] border border-white/5 rounded-xl p-3">
                  <span className="text-white/40 text-xs block mb-1">Estado de Atención:</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    selectedComplaint.status === 'RESOLVED'
                      ? 'bg-green-500/20 text-green-300 border-green-500/40'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                  }`}>
                    {selectedComplaint.status === 'RESOLVED' ? 'Atendido' : 'Pendiente'}
                  </span>
                </div>
              </div>

              <div className="bg-[#181818] border border-white/5 rounded-xl p-3">
                <span className="text-white/40 text-xs block mb-1">Bien o Servicio Contratado:</span>
                <span className="text-white font-medium">{selectedComplaint.serviceType}</span>
              </div>

              {/* Bloque: Detalle de los Hechos */}
              <div>
                <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
                  Detalle y Fundamentos de los Hechos:
                </h3>
                <div className="bg-[#161616] border border-white/10 rounded-xl p-4 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedComplaint.detail}
                </div>
              </div>

              {/* Bloque: Pedido del Consumidor */}
              {selectedComplaint.consumerRequest && (
                <div>
                  <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
                    Pedido Concreto del Consumidor:
                  </h3>
                  <div className="bg-[#161616] border border-white/10 rounded-xl p-4 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedComplaint.consumerRequest}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
              <a
                href={`mailto:${selectedComplaint.email}?subject=Respuesta a Reclamación REC-${selectedComplaint.id} - Hotel Gotitas`}
                className="px-4 py-2 rounded-xl bg-[#eca8d6] hover:bg-white text-black font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <Mail size={14} /> Responder por Correo
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusToggle(selectedComplaint)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    selectedComplaint.status === 'PENDING'
                      ? 'bg-green-500 text-black border-green-500 hover:bg-green-400'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 hover:bg-yellow-500/30'
                  }`}
                >
                  {selectedComplaint.status === 'PENDING' ? 'Marcar como Atendido' : 'Reabrir Reclamación'}
                </button>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs border border-white/10 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { CalendarRange, Plus, CheckCircle, LogOut, XCircle, Search, ShoppingCart, Trash2 } from 'lucide-react';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [error, setError] = useState('');

  const [showConsumptionsModal, setShowConsumptionsModal] = useState(false);
  const [consumptions, setConsumptions] = useState([]);
  const [activeServices, setActiveServices] = useState([]);
  const [consumptionForm, setConsumptionForm] = useState({ serviceId: '', quantity: 1 });


  // Formulario Creacion
  const [searchDates, setSearchDates] = useState({ checkIn: '', checkOut: '' });
  const [categories, setCategories] = useState([]);
  const [createData, setCreateData] = useState({ guestId: '', categoryId: '', notes: '' });

  useEffect(() => {
    fetchReservations();
    fetchGuests();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await apiClient('/reservations');
      if (res.ok) setReservations(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchGuests = async () => {
    try {
      const res = await apiClient('/guests');
      if (res.ok) setGuests(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSearchAvailability = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiClient('/rooms/search?checkIn=' + searchDates.checkIn + '&checkOut=' + searchDates.checkOut);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.filter(c => c.availableRooms > 0));
        if (data.filter(c => c.availableRooms > 0).length === 0) setError('No hay habitaciones disponibles en estas fechas.');
      }
    } catch (err) { setError('Error al buscar disponibilidad'); }
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiClient('/reservations', {
        method: 'POST',
        body: JSON.stringify({
          guestId: createData.guestId,
          categoryId: createData.categoryId,
          checkInDate: searchDates.checkIn,
          checkOutDate: searchDates.checkOut,
          notes: createData.notes
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear reserva');
      }
      setShowCreateModal(false);
      resetCreateForm();
      fetchReservations();
    } catch (err) { setError(err.message); }
  };

  const openCheckIn = async (res) => {
    setSelectedRes(res);
    try {
      const r = await apiClient('/rooms?status=AVAILABLE&categoryId=' + res.categoryId);
      if (r.ok) setAvailableRooms(await r.json());
      setShowCheckInModal(true);
    } catch (err) { console.error(err); }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiClient('/reservations/' + selectedRes.id + '/checkin?roomId=' + selectedRoomId, { method: 'PATCH' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al hacer check-in');
      }
      setShowCheckInModal(false);
      setSelectedRoomId('');
      fetchReservations();
    } catch (err) { setError(err.message); }
  };

  
  const openConsumptions = async (res) => {
    setSelectedRes(res);
    try {
      const s = await apiClient('/services?onlyActive=true');
      if (s.ok) setActiveServices(await s.json());
      fetchConsumptions(res.id);
      setShowConsumptionsModal(true);
    } catch (err) { console.error(err); }
  };

  const fetchConsumptions = async (resId) => {
    try {
      const r = await apiClient('/consumptions/reservation/' + resId);
      if (r.ok) setConsumptions(await r.json());
    } catch (err) { console.error(err); }
  };

  const handleAddConsumption = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiClient('/consumptions', {
        method: 'POST',
        body: JSON.stringify({ reservationId: selectedRes.id, ...consumptionForm })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al agregar consumo');
      }
      setConsumptionForm({ serviceId: '', quantity: 1 });
      fetchConsumptions(selectedRes.id);
    } catch (err) { setError(err.message); }
  };

  const handleRemoveConsumption = async (id) => {
    if(!window.confirm('¿Eliminar este consumo?')) return;
    try {
      const res = await apiClient('/consumptions/' + id, { method: 'DELETE' });
      if (res.ok) fetchConsumptions(selectedRes.id);
    } catch (err) { alert('Error al eliminar'); }
  };

    const handleCancelReservation = async (id) => {
    const reason = prompt("Ingrese el motivo de cancelacion (Ej. HOTEL_CANCELLATION, DUPLICATE_CHARGE):", "HOTEL_CANCELLATION");
    if (!reason) return;
    try {
      const res = await apiClient('/reservations/' + id + '/cancel?reason=' + reason, { method: 'PATCH' });
      if (res.ok) {
        alert('Reserva cancelada exitosamente.');
        fetchReservations();
      } else {
        const errorData = await res.json();
        alert('Error: ' + errorData.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async (id) => {
    if(!window.confirm('¿Confirmar Check-Out?')) return;
    try {
      const res = await apiClient('/reservations/' + id + '/checkout', { method: 'PATCH' });
      if (res.ok) fetchReservations();
    } catch (err) { alert('Error al hacer check-out'); }
  };

  const handleCancel = async (id) => {
    if(!window.confirm('¿Estás seguro de cancelar esta reserva?')) return;
    try {
      const res = await apiClient('/reservations/' + id + '/cancel', { method: 'PATCH' });
      if (res.ok) fetchReservations();
    } catch (err) { alert('Error al cancelar'); }
  };

  const resetCreateForm = () => {
    setSearchDates({ checkIn: '', checkOut: '' });
    setCategories([]);
    setCreateData({ guestId: '', categoryId: '', notes: '' });
    setError('');
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      CONFIRMED: 'bg-blue-500/20 text-blue-500 border-blue-500/50',
      CHECKED_IN: 'bg-green-500/20 text-green-500 border-green-500/50',
      CHECKED_OUT: 'bg-gray-500/20 text-gray-500 border-gray-500/50',
      CANCELLED: 'bg-red-500/20 text-red-500 border-red-500/50'
    };
    return <span className={'px-2 py-1 rounded-full text-xs font-bold border ' + (colors[status] || colors.PENDING)}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestión de Reservas</h2>
        <button 
          onClick={() => { resetCreateForm(); setShowCreateModal(true); }}
          className="flex items-center gap-2 bg-[#eca8d6] text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
        >
          <Plus size={20} /> Nueva Reserva
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/50 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-white/70">ID</th>
              <th className="px-4 py-3 font-semibold text-white/70">Huésped</th>
              <th className="px-4 py-3 font-semibold text-white/70">Categoría / Hab.</th>
              <th className="px-4 py-3 font-semibold text-white/70">Fechas</th>
              <th className="px-4 py-3 font-semibold text-white/70">Estado</th>
              <th className="px-4 py-3 font-semibold text-white/70">Total</th>
              <th className="px-4 py-3 font-semibold text-white/70 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-mono text-white/50">#{r.id}</td>
                <td className="px-4 py-3 font-medium">{r.guestName}</td>
                <td className="px-4 py-3">
                  <div className="text-white">{r.categoryName}</div>
                  {r.roomNumber && <div className="text-xs text-[#eca8d6]">Hab. {r.roomNumber}</div>}
                </td>
                <td className="px-4 py-3 text-white/70">
                  <div className="flex items-center gap-1"><CalendarRange size={12}/> {r.checkInDate} a {r.checkOutDate}</div>
                </td>
                <td className="px-4 py-3">{getStatusBadge(r.status)}</td>
                <td className="px-4 py-3 font-mono"></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {(r.status === 'CONFIRMED' || r.status === 'PENDING') && (
                      <>
                        <button onClick={() => openCheckIn(r)} title="Hacer Check-In" className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500/40"><CheckCircle size={16}/></button>
                        <button onClick={() => handleCancel(r.id)} title="Cancelar" className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/40"><XCircle size={16}/></button>
                      </>
                    )}
                    {r.status === 'CHECKED_IN' && (
                      <button onClick={() => handleCheckOut(r.id)} title="Hacer Check-Out" className="p-1.5 bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/40"><LogOut size={16}/></button>
                    )}
                  
                    {(r.status === 'CONFIRMED' || r.status === 'CHECKED_IN') && (
                      <button onClick={() => openConsumptions(r)} title="Consumos Extra" className="p-1.5 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/40"><ShoppingCart size={16}/></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && <tr><td colSpan="7" className="px-4 py-8 text-center text-white/50">No hay reservas</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva Reserva */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Crear Reserva</h2>
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">{error}</div>}
            
            <form onSubmit={handleSearchAvailability} className="flex gap-4 items-end mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex-1">
                <label className="block text-xs text-white/50 mb-1">Check-In</label>
                <input required type="date" value={searchDates.checkIn} onChange={e => setSearchDates({...searchDates, checkIn: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white/50 mb-1">Check-Out</label>
                <input required type="date" value={searchDates.checkOut} onChange={e => setSearchDates({...searchDates, checkOut: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
              </div>
              <button type="submit" className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"><Search size={16}/> Buscar</button>
            </form>

            {categories.length > 0 && (
              <form onSubmit={handleCreateReservation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Seleccionar Categoría Disponible</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map(c => (
                      <div key={c.categoryId} onClick={() => setCreateData({...createData, categoryId: c.categoryId})} className={'p-3 rounded-xl cursor-pointer border transition-all ' + (createData.categoryId === c.categoryId ? 'border-[#eca8d6] bg-[#eca8d6]/10' : 'border-white/10 bg-[#1a1a1a] hover:border-white/30')}>
                        <div className="font-bold">{c.name}</div>
                        <div className="text-sm text-[#eca8d6]"> / noche</div>
                        <div className="text-xs text-white/50 mt-1">Disponibles: {c.availableRooms}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {createData.categoryId && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Huésped</label>
                      <select required value={createData.guestId} onChange={e => setCreateData({...createData, guestId: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                        <option value="">-- Seleccionar Huésped --</option>
                        {guests.map(g => <option key={g.id} value={g.id}>{g.firstName} {g.lastName} ({g.documentNumber})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Notas (Opcional)</label>
                      <textarea value={createData.notes} onChange={e => setCreateData({...createData, notes: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none h-20" placeholder="Ej: Llegará tarde..." />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors">Cancelar</button>
                      <button type="submit" className="bg-[#eca8d6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition-colors">Confirmar Reserva</button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Check-In */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Check-In: Asignar Habitación</h2>
            <div className="text-white/70 mb-4 text-sm">Reserva #{selectedRes?.id} - {selectedRes?.guestName}</div>
            
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleCheckIn}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/70 mb-2">Habitaciones Disponibles (Categoría {selectedRes?.categoryName})</label>
                {availableRooms.length === 0 ? (
                  <div className="text-red-400 text-sm">No hay cuartos físicos libres y limpios. Verifica el inventario.</div>
                ) : (
                  <select required value={selectedRoomId} onChange={e => setSelectedRoomId(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                    <option value="">-- Seleccionar Cuarto --</option>
                    {availableRooms.map(r => <option key={r.id} value={r.id}>Habitación {r.roomNumber} - Piso {r.floor}</option>)}
                  </select>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowCheckInModal(false)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5">Cancelar</button>
                <button type="submit" disabled={availableRooms.length === 0} className="bg-green-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-green-400 disabled:opacity-50">Hacer Check-In</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Consumos */}
      {showConsumptionsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Consumos Extra</h2>
              <button onClick={() => setShowConsumptionsModal(false)} className="text-white/50 hover:text-white"><XCircle size={24}/></button>
            </div>
            
            <div className="text-white/70 mb-6 pb-4 border-b border-white/10">
              Reserva #{selectedRes?.id} - {selectedRes?.guestName}
            </div>
            
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4 flex-shrink-0">{error}</div>}

            <form onSubmit={handleAddConsumption} className="flex gap-4 items-end mb-6 bg-white/5 p-4 rounded-xl border border-white/10 flex-shrink-0">
              <div className="flex-[2]">
                <label className="block text-xs text-white/50 mb-1">Servicio</label>
                <select required value={consumptionForm.serviceId} onChange={e => setConsumptionForm({...consumptionForm, serviceId: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                  <option value="">-- Seleccionar --</option>
                  {activeServices.map(s => <option key={s.id} value={s.id}>{s.name} ()</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white/50 mb-1">Cantidad</label>
                <input required type="number" min="1" value={consumptionForm.quantity} onChange={e => setConsumptionForm({...consumptionForm, quantity: parseInt(e.target.value)})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
              </div>
              <button type="submit" className="bg-[#eca8d6] text-black px-4 py-2 rounded-lg hover:bg-white transition-colors font-semibold flex items-center gap-2"><Plus size={16}/> Agregar</button>
            </form>

            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-white/70">Servicio</th>
                    <th className="px-4 py-2 font-semibold text-white/70">Cant.</th>
                    <th className="px-4 py-2 font-semibold text-white/70">Precio U.</th>
                    <th className="px-4 py-2 font-semibold text-white/70">Subtotal</th>
                    <th className="px-4 py-2 font-semibold text-white/70 text-right">Quitar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {consumptions.map(c => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="px-4 py-3">{c.serviceName}</td>
                      <td className="px-4 py-3">{c.quantity}</td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3 font-bold text-[#eca8d6]"></td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" onClick={() => handleRemoveConsumption(c.id)} className="text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                  {consumptions.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-white/50">No hay consumos registrados.</td></tr>}
                </tbody>
                {consumptions.length > 0 && (
                  <tfoot className="bg-black/30">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right font-bold">TOTAL CONSUMOS:</td>
                      <td className="px-4 py-3 font-bold text-[#eca8d6] text-lg"></td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


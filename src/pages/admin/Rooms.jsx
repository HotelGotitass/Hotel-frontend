import React, { useState, useEffect } from 'react';
import { Plus, BedDouble, Edit2, Trash2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useTranslation } from 'react-i18next';

export default function Rooms() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ roomNumber: '', floor: '', categoryId: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchRooms();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient('/categories');
      if (response.ok) setCategories(await response.json());
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await apiClient('/rooms');
      if (response.ok) setRooms(await response.json());
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ roomNumber: '', floor: '', categoryId: '' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (room) => {
    setEditingId(room.id);
    setFormData({
      roomNumber: room.roomNumber,
      floor: String(room.floor),
      categoryId: String(room.category?.id || '')
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = {
        roomNumber: formData.roomNumber,
        floor: parseInt(formData.floor),
        categoryId: parseInt(formData.categoryId),
        status: 'AVAILABLE'
      };

      const endpoint = editingId ? `/rooms/${editingId}` : '/rooms';
      const method = editingId ? 'PUT' : 'POST';

      const res = await apiClient(endpoint, {
        method,
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setShowModal(false);
        fetchRooms();
      } else {
        const data = await res.json();
        setError(data.message || 'Error al guardar habitación');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('rooms.confirm_delete'))) return;
    try {
      const res = await apiClient(`/rooms/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        fetchRooms();
      } else {
        const data = await res.json();
        alert(data.message || 'Error al eliminar');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'AVAILABLE': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'OCCUPIED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'CLEANING': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'MAINTENANCE': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-white/50 bg-white/5 border-white/10';
    }
  };

  const getStatusLabel = (status) => {
    const map = {
      AVAILABLE: t('status.available'),
      OCCUPIED: t('status.occupied'),
      CLEANING: t('status.cleaning'),
      MAINTENANCE: t('status.maintenance')
    };
    return map[status] || status;
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      await apiClient(`/rooms/${roomId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      fetchRooms();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">{t('rooms.title')}</h2>
          <p className="text-white/60 text-sm mt-1">{t('rooms.subtitle')}</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-white/90 transition-all"
        >
          <Plus size={16} /> {t('rooms.add')}
        </button>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#161616]">
              <th className="p-4 text-sm font-medium text-white/40 uppercase tracking-wider">{t('rooms.number')}</th>
              <th className="p-4 text-sm font-medium text-white/40 uppercase tracking-wider">{t('rooms.floor')}</th>
              <th className="p-4 text-sm font-medium text-white/40 uppercase tracking-wider">{t('rooms.category')}</th>
              <th className="p-4 text-sm font-medium text-white/40 uppercase tracking-wider">{t('rooms.current_status')}</th>
              <th className="p-4 text-sm font-medium text-white/40 uppercase tracking-wider text-right">{t('rooms.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rooms.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-white/40">{t('rooms.no_rooms')}</td>
              </tr>
            )}
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-mono text-lg flex items-center gap-3">
                  <BedDouble size={20} className="text-[#eca8d6]" />
                  {room.roomNumber}
                </td>
                <td className="p-4 text-white/70">{room.floor}</td>
                <td className="p-4 text-white/70">{room.category?.name || '-'}</td>
                <td className="p-4">
                  <select 
                    value={room.status}
                    onChange={(e) => handleStatusChange(room.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border appearance-none cursor-pointer outline-none ${getStatusColor(room.status)}`}
                  >
                    <option value="AVAILABLE" className="bg-black text-white">{t('status.available')}</option>
                    <option value="OCCUPIED" className="bg-black text-white">{t('status.occupied')}</option>
                    <option value="CLEANING" className="bg-black text-white">{t('status.cleaning')}</option>
                    <option value="MAINTENANCE" className="bg-black text-white">{t('status.maintenance')}</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => openEdit(room)}
                      title={t('common.edit')}
                      className="text-[#eca8d6] hover:text-[#f5b5d8] transition-colors p-1"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      title={t('common.delete')}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear/Editar Habitación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-6">
              {editingId ? t('rooms.edit_title') : t('rooms.add_title')}
            </h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">{t('rooms.number')}</label>
                  <input
                    required
                    type="text"
                    value={formData.roomNumber}
                    onChange={e => setFormData({...formData, roomNumber: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#eca8d6]/50 outline-none"
                    placeholder="101"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">{t('rooms.floor')}</label>
                  <input
                    required
                    type="number"
                    value={formData.floor}
                    onChange={e => setFormData({...formData, floor: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#eca8d6]/50 outline-none"
                    placeholder="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">{t('rooms.category')}</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#eca8d6]/50 outline-none appearance-none"
                >
                  <option value="" disabled>{t('rooms.select_category')}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm"
                >
                  {t('rooms.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-white text-black font-medium hover:bg-[#eca8d6] transition-colors text-sm"
                >
                  {t('rooms.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

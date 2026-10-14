import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useTranslation } from 'react-i18next';

export default function Amenities() {
  const { t } = useTranslation();
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' });

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await apiClient('/amenities');
      if (response.ok) {
        setAmenities(await response.json());
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', icon: '' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (amenity) => {
    setEditingId(amenity.id);
    setFormData({
      name: amenity.name,
      description: amenity.description || '',
      icon: amenity.icon || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = editingId ? `/amenities/${editingId}` : '/amenities';
      const method = editingId ? 'PUT' : 'POST';

      const res = await apiClient(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchAmenities();
      } else {
        const data = await res.json();
        setError(data.message || t('common.error'));
      }
    } catch (err) {
      setError(t('common.error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('common.confirm'))) return;
    try {
      const res = await apiClient(`/amenities/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        fetchAmenities();
      } else {
        const data = await res.json();
        alert(data.message || t('common.error'));
      }
    } catch (err) {
      alert(t('common.error'));
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">{t('amenities.title')}</h2>
          <p className="text-white/60 text-sm mt-1">{t('amenities.subtitle')}</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#eca8d6] text-black font-semibold text-sm rounded-lg hover:bg-white transition-colors"
        >
          <Plus size={16} /> {t('amenities.add')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {amenities.length === 0 && !loading && (
          <div className="col-span-full p-8 text-center text-white/40 bg-[#111] border border-white/10 rounded-xl">
            {t('amenities.no_amenities')}
          </div>
        )}
        {amenities.map((am) => (
          <div key={am.id} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-white/30 transition-all flex flex-col">
            <div className="w-12 h-12 bg-black/50 rounded-lg flex items-center justify-center text-2xl mb-4 border border-white/5">
              {am.icon ? am.icon : <Star size={20} className="text-white/40" />}
            </div>
            <h3 className="font-bold text-lg mb-2">{am.name}</h3>
            <p className="text-white/50 text-sm flex-1">{am.description}</p>
            
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
              <button
                onClick={() => openEdit(am)}
                title={t('common.edit')}
                className="flex-1 py-1.5 flex justify-center items-center text-white/50 hover:bg-white/5 rounded transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(am.id)}
                title={t('common.delete')}
                className="flex-1 py-1.5 flex justify-center items-center text-red-400/70 hover:bg-red-400/10 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-6">
              {editingId ? t('common.edit') : t('amenities.add_title')}
            </h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">{t('amenities.name')}</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#eca8d6]/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">{t('amenities.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#eca8d6]/50 outline-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">{t('amenities.icon')}</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={e => setFormData({...formData, icon: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#eca8d6]/50 outline-none"
                  placeholder={t('amenities.icon_placeholder')}
                />
              </div>
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm"
                >
                  {t('amenities.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-white text-black font-medium hover:bg-[#eca8d6] transition-colors text-sm"
                >
                  {t('amenities.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

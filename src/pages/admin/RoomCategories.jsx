import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tags, Users as UsersIcon } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useTranslation } from 'react-i18next';

export default function RoomCategories() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    maxCapacity: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient('/categories');
      if (response.ok) setCategories(await response.json());
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', basePrice: '', maxCapacity: '' });
    setImageFile(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      basePrice: String(cat.basePrice || ''),
      maxCapacity: String(cat.maxCapacity || '')
    });
    setImageFile(null);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        maxCapacity: parseInt(formData.maxCapacity)
      };

      const endpoint = editingId ? `/categories/${editingId}` : '/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await apiClient(endpoint, {
        method,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al guardar categoría');
      }

      const saved = await res.json();

      // Si hay imagen nueva, subirla
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        await apiClient(`/categories/${saved.id}/image`, {
          method: 'POST',
          body: uploadData
        });
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('categories.confirm_delete'))) return;
    try {
      const res = await apiClient(`/categories/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.message || 'Error al eliminar');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">{t('categories.title')}</h2>
          <p className="text-white/60 text-sm mt-1">{t('categories.subtitle')}</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-white/90 transition-all"
        >
          <Plus size={16} /> {t('categories.add')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 && !loading && (
          <div className="col-span-full p-8 text-center border border-white/10 rounded-xl text-white/40">
            {t('categories.no_categories')}
          </div>
        )}
        {categories.map((cat) => (
          <div key={cat.id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-all flex flex-col">
            {/* Image */}
            <div className="h-40 w-full bg-[#1a1a1a] border-b border-white/10 overflow-hidden relative group">
              {cat.imageUrl ? (
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                  <Tags size={32} className="mb-2" />
                  <span className="text-xs">{t('categories.no_image')}</span>
                </div>
              )}
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{cat.name}</h3>
                <div className="text-[#eca8d6] font-mono text-xl">S/ {cat.basePrice}</div>
              </div>
              
              <p className="text-sm text-white/40 mb-6 line-clamp-2 flex-1">
                {cat.description || 'Sin descripción detallada.'}
              </p>
              
              <div className="flex items-center gap-2 text-white/50 text-sm mb-6">
                <UsersIcon size={16} />
                <span>{t('categories.capacity_label')}</span>
                <span className="text-white font-medium">{cat.maxCapacity} {t('categories.persons')}</span>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex-1 flex justify-center items-center gap-2 py-2 text-sm text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit2 size={14} /> {t('common.edit')}
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="flex-1 flex justify-center items-center gap-2 py-2 text-sm text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"
                >
                  <Trash2 size={14} /> {t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear/Editar Categoría */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">
              {editingId ? t('categories.edit_title') : t('categories.add_title')}
            </h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">{t('categories.name')}</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#eca8d6]/50 outline-none"
                  placeholder="Ej. Suite Presidencial"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-1">{t('categories.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#eca8d6]/50 outline-none"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">{t('categories.base_price')}</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={e => setFormData({...formData, basePrice: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#eca8d6]/50 outline-none"
                    placeholder="150.00"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">{t('categories.max_capacity')}</label>
                  <input
                    required
                    type="number"
                    value={formData.maxCapacity}
                    onChange={e => setFormData({...formData, maxCapacity: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#eca8d6]/50 outline-none"
                    placeholder="2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">{t('categories.image')}</label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={e => setImageFile(e.target.files[0])}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm"
                >
                  {t('categories.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-white text-black font-medium hover:bg-[#eca8d6] transition-colors text-sm"
                >
                  {t('categories.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

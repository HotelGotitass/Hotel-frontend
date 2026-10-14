import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../utils/apiClient';
import { Plus, Edit2 } from 'lucide-react';

export default function ExtraServices() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, isActive: true });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await apiClient('/services');
      if (res.ok) setServices(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = editingId ? '/services/' + editingId : '/services';
      const method = editingId ? 'PUT' : 'POST';

      const res = await apiClient(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || t('common.error'));
      }

      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (err) { setError(err.message); }
  };

  const openEdit = (s) => {
    setFormData({ name: s.name, description: s.description || '', price: s.price, isActive: s.isActive });
    setEditingId(s.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: 0, isActive: true });
    setEditingId(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t('services.title')}</h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#eca8d6] text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
        >
          <Plus size={20} /> {t('services.add')}
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold text-white/70">{t('services.name')}</th>
              <th className="px-6 py-4 font-semibold text-white/70">{t('services.price')}</th>
              <th className="px-6 py-4 font-semibold text-white/70">{t('services.status')}</th>
              <th className="px-6 py-4 font-semibold text-white/70 text-right">{t('services.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold">{s.name}</div>
                  <div className="text-sm text-white/50">{s.description}</div>
                </td>
                <td className="px-6 py-4 font-mono text-[#eca8d6]">S/ {s.price?.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={'px-2 py-1 rounded-full text-xs font-bold border ' + (s.isActive ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'bg-red-500/20 text-red-500 border-red-500/50')}>
                    {s.isActive ? t('status.active').toUpperCase() : t('status.inactive').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(s)} className="p-2 text-white/50 hover:text-white transition-colors"><Edit2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{editingId ? t('services.edit_title') : t('services.add_title')}</h2>
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('services.name')}</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('services.description')}</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none h-20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('services.unit_price')}</label>
                <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 accent-[#eca8d6]" />
                <label className="text-sm font-medium text-white/70">{t('services.available')}</label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors">{t('services.cancel')}</button>
                <button type="submit" className="bg-[#eca8d6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition-colors">{t('services.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useTranslation } from 'react-i18next';

export default function Guests() {
  const { t } = useTranslation();
  const [guests, setGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', documentType: 'DNI', documentNumber: '', email: '', phone: '', address: ''
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async (query = '') => {
    try {
      const url = query ? `/guests?query=${encodeURIComponent(query)}` : '/guests';
      const response = await apiClient(url);
      if (response.ok) {
        setGuests(await response.json());
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGuests(searchQuery);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = editingId ? `/guests/${editingId}` : '/guests';
      const method = editingId ? 'PUT' : 'POST';

      const response = await apiClient(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('common.error'));
      }

      setShowModal(false);
      resetForm();
      fetchGuests();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEdit = (guest) => {
    setFormData({
      firstName: guest.firstName,
      lastName: guest.lastName,
      documentType: guest.documentType,
      documentNumber: guest.documentNumber,
      email: guest.email || '',
      phone: guest.phone || '',
      address: guest.address || ''
    });
    setEditingId(guest.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', documentType: 'DNI', documentNumber: '', email: '', phone: '', address: ''
    });
    setEditingId(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">{t('guests.title')}</h2>
          <p className="text-white/60 text-sm mt-1">{t('guests.subtitle')}</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#eca8d6] text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
        >
          <Plus size={20} /> {t('guests.add')}
        </button>
      </div>

      <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/30">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('guests.search')}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-[#eca8d6]/50 outline-none"
              />
            </div>
            <button type="submit" className="bg-white/10 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium">
              {t('common.search')}
            </button>
          </form>
        </div>

        <table className="w-full text-left">
          <thead className="bg-[#161616] border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-white/40 uppercase tracking-wider">{t('auth.name')}</th>
              <th className="px-6 py-4 text-sm font-medium text-white/40 uppercase tracking-wider">{t('auth.document')}</th>
              <th className="px-6 py-4 text-sm font-medium text-white/40 uppercase tracking-wider">{t('footer.contact')}</th>
              <th className="px-6 py-4 text-sm font-medium text-white/40 uppercase tracking-wider text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {guests.map((g) => (
              <tr key={g.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium">{g.firstName} {g.lastName}</td>
                <td className="px-6 py-4 text-white/70">
                  <span className="text-xs text-white/40 block mb-0.5">{g.documentType}</span>
                  {g.documentNumber}
                </td>
                <td className="px-6 py-4 text-white/70">
                  <div className="text-sm truncate max-w-[200px]" title={g.email}>{g.email || '-'}</div>
                  <div className="text-sm mt-0.5">{g.phone || '-'}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(g)} className="p-2 text-[#eca8d6] hover:text-[#f5b5d8] transition-colors" title={t('common.edit')}>
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr><td colSpan="4" className="px-6 py-12 text-center text-white/50">{t('guests.no_guests')}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">{editingId ? t('guests.edit_title') : t('guests.add_title')}</h3>
            
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">{t('guests.first_name')}</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/50" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">{t('guests.last_name')}</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">{t('guests.doc_type')}</label>
                  <select required value={formData.documentType} onChange={e => setFormData({...formData, documentType: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/50 appearance-none">
                    <option value="DNI">DNI</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="CE">C.E.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">{t('guests.doc_number')}</label>
                  <input required type="text" value={formData.documentNumber} onChange={e => setFormData({...formData, documentNumber: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">{t('guests.email')}</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/50" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">{t('guests.phone')}</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">{t('guests.address')}</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/50" />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 transition-colors text-sm">{t('guests.cancel')}</button>
                <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#eca8d6] transition-colors text-sm">{t('guests.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

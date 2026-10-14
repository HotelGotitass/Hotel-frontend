import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient, BASE_URL } from '../../utils/apiClient';
import { FileText, Download, CheckCircle } from 'lucide-react';

export default function Invoices() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
    fetchReservations();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await apiClient('/invoices');
      if (res.ok) setInvoices(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchReservations = async () => {
    try {
      const res = await apiClient('/reservations');
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (err) { console.error(err); }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiClient('/invoices/reservation/' + selectedReservationId, { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || t('common.error'));
      }
      setShowGenerateModal(false);
      setSelectedReservationId('');
      fetchInvoices();
    } catch (err) { setError(err.message); }
  };

  const handlePay = async (id) => {
    if (!window.confirm(t('invoices.confirm_pay'))) return;
    try {
      const res = await apiClient('/invoices/' + id + '/pay', { method: 'PATCH' });
      if (res.ok) fetchInvoices();
    } catch (err) { alert(t('common.error')); }
  };

  const handleDownloadPdf = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/invoices/${id}/pdf`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!response.ok) throw new Error(t('invoices.download_error'));

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Factura_' + id + '.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(t('invoices.download_error'));
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'PAID') return <span className="bg-green-500/20 text-green-500 border border-green-500/50 px-2 py-1 rounded-full text-xs font-bold">{t('status.paid').toUpperCase()}</span>;
    if (status === 'VOID') return <span className="bg-red-500/20 text-red-500 border border-red-500/50 px-2 py-1 rounded-full text-xs font-bold">{t('status.void').toUpperCase()}</span>;
    return <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-2 py-1 rounded-full text-xs font-bold">{t('status.pending').toUpperCase()}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t('invoices.title')}</h2>
        <button
          onClick={() => { setError(''); setShowGenerateModal(true); }}
          className="flex items-center gap-2 bg-[#eca8d6] text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
        >
          <FileText size={20} /> {t('invoices.generate')}
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/50 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-white/70">{t('invoices.id')}</th>
              <th className="px-4 py-3 font-semibold text-white/70">{t('invoices.reservation')}</th>
              <th className="px-4 py-3 font-semibold text-white/70">{t('invoices.guest')}</th>
              <th className="px-4 py-3 font-semibold text-white/70">{t('invoices.total')}</th>
              <th className="px-4 py-3 font-semibold text-white/70">{t('invoices.status')}</th>
              <th className="px-4 py-3 font-semibold text-white/70 text-right">{t('invoices.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-mono text-white/50">F-{inv.id}</td>
                <td className="px-4 py-3 font-mono">#{inv.reservationId}</td>
                <td className="px-4 py-3">{inv.guestName} <span className="text-xs text-white/50">({inv.documentNumber})</span></td>
                <td className="px-4 py-3 font-bold text-[#eca8d6]">S/ {inv.totalAmount?.toFixed(2)}</td>
                <td className="px-4 py-3">{getStatusBadge(inv.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {inv.status === 'PENDING' && (
                      <button onClick={() => handlePay(inv.id)} title={t('common.confirm')} className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500/40"><CheckCircle size={16}/></button>
                    )}
                    <button onClick={() => handleDownloadPdf(inv.id)} title={t('invoices.download_error')} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40"><Download size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && <tr><td colSpan="6" className="px-4 py-8 text-center text-white/50">{t('invoices.no_invoices')}</td></tr>}
          </tbody>
        </table>
      </div>

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{t('invoices.generate_title')}</h2>
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('invoices.select_reservation')}</label>
                <select required value={selectedReservationId} onChange={e => setSelectedReservationId(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                  <option value="">{t('invoices.select_reservation_placeholder')}</option>
                  {reservations.map(r => (
                    <option key={r.id} value={r.id}>#{r.id} - {r.guestName} ({r.status})</option>
                  ))}
                </select>
                <p className="text-xs text-white/50 mt-2">{t('invoices.generate_info')}</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowGenerateModal(false)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors">{t('invoices.cancel')}</button>
                <button type="submit" className="bg-[#eca8d6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition-colors">{t('invoices.generate_btn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

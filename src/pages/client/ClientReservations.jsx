import React, { useState, useEffect } from 'react';
import { apiClient, BASE_URL } from '../../utils/apiClient';
import { Calendar, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ClientReservations() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedResForModify, setSelectedResForModify] = useState(null);
  const [newDates, setNewDates] = useState({ checkIn: '', checkOut: '' });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await apiClient('/client/reservations');
      if (res.ok) setReservations(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm(t('reservations.confirm_cancel'))) return;
    try {
      const res = await apiClient('/client/reservations/' + id + '/cancel', { method: 'POST' });
      if (res.ok) fetchReservations();
      else alert('Error al cancelar la reserva');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownloadInvoice = async (reservationId) => {
    try {
      const res = await apiClient('/invoices/reservation/' + reservationId);
      if (res.ok) {
        const invoice = await res.json();
        const token = localStorage.getItem('token');
        // Descargar como blob
        const pdfRes = await fetch(`${BASE_URL}/invoices/${invoice.id}/pdf`, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!pdfRes.ok) throw new Error();
        const blob = await pdfRes.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Factura_' + invoice.id + '.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert(t('invoices.download_error') || 'La factura aún no ha sido generada por el hotel.');
      }
    } catch (err) {
      alert('Error al obtener la factura.');
    }
  };

  const handleOpenModify = (res) => {
    setSelectedResForModify(res);
    setNewDates({ checkIn: res.checkInDate, checkOut: res.checkOutDate });
    setShowModifyModal(true);
  };

  const submitModifyDates = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient('/client/reservations/' + selectedResForModify.id + '/dates', {
        method: 'PATCH',
        body: JSON.stringify({ newCheckIn: newDates.checkIn, newCheckOut: newDates.checkOut })
      });
      if (res.ok) {
        setShowModifyModal(false);
        fetchReservations();
      } else {
        const data = await res.json();
        alert('Error: ' + (data.message || 'No se pudo modificar'));
      }
    } catch (err) {
      alert('Error de red');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return (
        <span className="bg-yellow-900/30 border border-yellow-500/30 text-yellow-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <Clock className="w-3 h-3"/> {t('status.pending')}
        </span>
      );
      case 'CONFIRMED': return (
        <span className="bg-green-900/30 border border-green-500/30 text-green-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <CheckCircle className="w-3 h-3"/> {t('status.confirmed')}
        </span>
      );
      case 'CHECKED_IN': return (
        <span className="bg-blue-900/30 border border-blue-500/30 text-blue-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <CheckCircle className="w-3 h-3"/> {t('status.checked_in')}
        </span>
      );
      case 'CHECKED_OUT': return (
        <span className="bg-purple-900/30 border border-purple-500/30 text-purple-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <CheckCircle className="w-3 h-3"/> {t('status.checked_out')}
        </span>
      );
      case 'CANCELLED': return (
        <span className="bg-red-900/30 border border-red-500/30 text-red-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <XCircle className="w-3 h-3"/> {t('status.cancelled')}
        </span>
      );
      default: return (
        <span className="bg-white/10 text-white/60 px-2 py-1 rounded text-xs font-bold">{status}</span>
      );
    }
  };

  if (loading) return (
    <div className="text-center mt-20 text-white/60">{t('client.loading')}</div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-2 text-white">{t('client.my_reservations')}</h2>
      <p className="text-white/50 text-sm mb-8">{t('client.history')}</p>
      
      {reservations.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-12 rounded-2xl text-center text-white/50">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">{t('client.no_reservations')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(res => (
            <div key={res.id} className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {res.bookingCode && (
                    <span className="font-mono bg-white/10 px-2 py-1 rounded text-sm text-white/70">
                      {res.bookingCode}
                    </span>
                  )}
                  {getStatusBadge(res.status)}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{res.categoryName}</h3>
                <div className="text-white/50 text-sm flex flex-col gap-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4"/> {res.checkInDate} → {res.checkOutDate}
                  </span>
                  {res.status === 'CANCELLED' && res.cancellationReason && (
                    <span className="flex items-center gap-1 text-red-400 mt-1">
                      <AlertTriangle className="w-4 h-4"/>
                      {t('client.cancelled_by')}: {res.cancelledBy} — {res.cancellationReason}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <div className="text-xs text-white/40">{t('client.total')}</div>
                  <div className="text-xl font-bold text-[#eca8d6]">
                    S/ {Number(res.totalPrice).toFixed(2)}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-end">
                  {/* Pagar */}
                  {res.status === 'PENDING' && (
                    <button
                      onClick={() => {
                        sessionStorage.setItem('pendingPayment', JSON.stringify({
                          reservationId: res.id,
                          bookingCode: res.bookingCode,
                          totalPrice: res.totalPrice,
                          depositPercentage: 50
                        }));
                        window.location.href = '/payment-gateway';
                      }}
                      className="text-sm bg-[#eca8d6] text-black px-3 py-1.5 rounded-lg hover:bg-white transition-colors font-semibold"
                    >
                      {t('client.pay_now')}
                    </button>
                  )}

                  {/* Modificar fechas */}
                  {(res.status === 'PENDING' || res.status === 'CONFIRMED') && res.modificationCount === 0 && (
                    <button
                      onClick={() => handleOpenModify(res)}
                      className="text-sm border border-blue-500/50 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors flex items-center gap-1"
                    >
                      <Edit2 size={14}/> {t('client.modify')}
                    </button>
                  )}

                  {/* Cancelar */}
                  {(res.status === 'PENDING' || res.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancel(res.id)}
                      className="text-sm border border-red-500/50 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      {t('client.cancel')}
                    </button>
                  )}

                  {/* Factura */}
                  {res.status !== 'CANCELLED' && res.status !== 'PENDING' && (
                    <button
                      onClick={() => handleDownloadInvoice(res.id)}
                      className="text-sm border border-white/20 text-white/60 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1"
                    >
                      <FileText size={14}/> {t('client.invoice')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Modificar Fechas */}
      {showModifyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-3 text-white">{t('client.modify')}</h3>
            <p className="text-sm text-white/50 mb-6">
              {t('client.modify_info')}
            </p>
            <form onSubmit={submitModifyDates} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t("client.new_checkin")}</label>
                <input
                  type="date"
                  required
                  value={newDates.checkIn}
                  onChange={e => setNewDates({...newDates, checkIn: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t("client.new_checkout")}</label>
                <input
                  type="date"
                  required
                  value={newDates.checkOut}
                  onChange={e => setNewDates({...newDates, checkOut: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/50"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModifyModal(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 transition-colors"
                >
                  {t("client.btn_cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#eca8d6] text-black rounded-lg font-semibold hover:bg-white transition-colors"
                >
                  {t("client.btn_save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

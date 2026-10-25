import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, FileText, CheckCircle, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import PaymentModal from '../../components/admin/PaymentModal';
import { apiClient } from '../../utils/apiClient';
import { downloadPdfResponse } from '../../utils/download';

export default function Reception() {
  const { t } = useTranslation();
  const [bookingCode, setBookingCode] = useState('');
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [notice, setNotice] = useState('');

  const refresh = async (code) => {
    const res = await apiClient('/reservations/code/' + code);
    if (res.ok) setReservation(await res.json());
  };

  const handlePayment = async ({ amount, method, reference }) => {
    const res = await apiClient(`/reservations/${reservation.id}/payments`, {
      method: 'POST',
      body: JSON.stringify({ amount, method, reference }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || t('common.error'));
    setPaying(false);
    setNotice(t('payments.registered', { amount: Number(data.amount).toFixed(2), balance: Number(data.balanceDue).toFixed(2) }));
    await refresh(reservation.bookingCode);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookingCode) return;
    setNotice('');

    setLoading(true);
    setError('');
    setReservation(null);

    try {
      const res = await apiClient('/reservations/code/' + bookingCode);
      if (!res.ok) throw new Error('Reserva no encontrada');
      setReservation(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    alert(t('reception.checkin_info'));
  };

  const handleDownloadInvoice = async (reservationId) => {
    try {
      const res = await apiClient('/invoices/reservation/' + reservationId);
      if (res.ok) {
        const invoice = await res.json();
        // Se descarga como blob porque el endpoint requiere el Bearer token (window.open no lo envia)
        const pdfRes = await apiClient(`/invoices/${invoice.id}/pdf`, { headers: { Accept: 'application/pdf' } });
        await downloadPdfResponse(pdfRes, `${invoice.number || 'Comprobante_' + invoice.id}.pdf`);
      } else {
        alert(t('reception.invoice_error'));
      }
    } catch (err) {
      alert(err.message || t('reception.invoice_fetch_error'));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">{t('reception.title')}</h1>

      <div className="bg-[#111] p-6 rounded-xl border border-white/10 shadow-lg">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder={t('reception.search_placeholder')}
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-12 pr-4 py-4 text-white focus:border-[#eca8d6]/50 outline-none uppercase font-mono text-lg tracking-wider"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#eca8d6] text-black px-8 py-4 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('reception.search_btn')}
          </button>
        </form>
        {error && <p className="text-red-400 mt-4 text-sm font-medium">{error}</p>}
      </div>

      {reservation && (
        <div className="bg-[#111] p-8 rounded-xl border border-white/10 shadow-lg">
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-3">
                {t('client.booking_code')}: 
                <span className="font-mono text-[#eca8d6] bg-[#eca8d6]/10 px-3 py-1 rounded-lg">
                  {reservation.bookingCode || bookingCode}
                </span>
              </h2>
            </div>
            <span className="bg-white/10 px-4 py-1.5 rounded-full text-sm font-bold text-white/80 border border-white/10">
              {t(`status.${reservation.status?.toLowerCase()}`) || reservation.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-sm text-white/50 mb-1">{t('reception.client')}</p>
              <p className="font-bold text-lg">{reservation.guestName}</p>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-1">{t('reception.category')}</p>
              {/* BUG FIX: The backend DTO field is 'categoryName', not 'roomCategoryName' */}
              <p className="font-bold text-lg">{reservation.categoryName}</p>
              {reservation.roomNumber && (
                <p className="text-sm text-[#eca8d6] mt-1">{t('reception.room')} {reservation.roomNumber}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-white/50 mb-1">{t('reception.dates')}</p>
              <p className="font-bold">{reservation.checkInDate}</p>
              <p className="font-bold text-white/70">{reservation.checkOutDate}</p>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-1">{t('reception.total_label')}</p>
              <p className="font-bold text-2xl text-[#eca8d6]">S/ {reservation.totalPrice?.toFixed(2)}</p>
              <p className="text-xs text-white/50 mt-1">
                {t('payments.paid')}: S/ {Number(reservation.amountPaid || 0).toFixed(2)} · {t('payments.balance')}: S/ {Number(reservation.balanceDue || 0).toFixed(2)}
              </p>
              {reservation.guests && <p className="text-xs text-white/40">{t('publicRooms.guests_count', { count: reservation.guests })}</p>}
            </div>
          </div>

          {notice && (
            <div role="status" className="mb-6 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {notice} <Link to="/admin/caja" className="underline ml-1">{t('cash.title')}</Link>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-white/10">
            {reservation.status === 'CONFIRMED' && (
              <button
                onClick={handleCheckIn}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
              >
                <CheckCircle size={20} />
                {t('reception.checkin_btn')}
              </button>
            )}
            {reservation.status !== 'CANCELLED' && (
              <button
                onClick={() => setPaying(true)}
                className="flex items-center gap-2 bg-[#eca8d6] text-black px-6 py-3 rounded-xl hover:bg-white transition-colors font-semibold"
              >
                <Banknote size={20} />
                {t('payments.register_payment')}
              </button>
            )}
            <button
              onClick={() => handleDownloadInvoice(reservation.id)}
              className="flex items-center gap-2 border border-white/20 bg-white/5 text-white/80 px-6 py-3 rounded-xl hover:bg-white/10 transition-colors font-semibold"
            >
              <FileText size={20} />
              {t('reception.download_invoice')}
            </button>
          </div>
        </div>
      )}

      {paying && reservation && (
        <PaymentModal
          title={t('payments.register_payment')}
          subtitle={`${reservation.bookingCode} · ${reservation.guestName}`}
          defaultAmount={reservation.balanceDue > 0 ? reservation.balanceDue : ''}
          onSubmit={handlePayment}
          onClose={() => setPaying(false)}
        />
      )}
    </div>
  );
}

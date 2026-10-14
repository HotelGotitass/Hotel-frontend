import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, FileText, CheckCircle } from 'lucide-react';
import { apiClient, BASE_URL } from '../../utils/apiClient';

export default function Reception() {
  const { t } = useTranslation();
  const [bookingCode, setBookingCode] = useState('');
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookingCode) return;

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
        const token = localStorage.getItem('token');
        
        // Fetch the PDF as blob instead of opening in a new tab (requires Bearer token which window.open doesn't send)
        const pdfRes = await fetch(`${BASE_URL}/invoices/${invoice.id}/pdf`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!pdfRes.ok) throw new Error();
        
        const blob = await pdfRes.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Factura_${invoice.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert(t('reception.invoice_error'));
      }
    } catch (err) {
      alert(t('reception.invoice_fetch_error'));
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
            </div>
          </div>

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
    </div>
  );
}

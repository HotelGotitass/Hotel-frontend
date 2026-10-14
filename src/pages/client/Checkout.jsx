import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Calendar, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // BUG FIX: Ahora lee 'bookingDetails' (igual que PublicRooms guarda)
    const data = sessionStorage.getItem('bookingDetails');
    if (!data) {
      navigate('/habitaciones');
    } else {
      setBookingData(JSON.parse(data));
    }
  }, [navigate]);

  const calculateDays = () => {
    if (!bookingData) return 0;
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const handleConfirmReservation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient('/client/reservations', {
        method: 'POST',
        body: JSON.stringify({
          categoryId: bookingData.categoryId,
          checkInDate: bookingData.checkIn,
          checkOutDate: bookingData.checkOut
        })
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.removeItem('bookingDetails');

        // Guardar datos de pago pendiente en sessionStorage para PaymentGatewayMock
        sessionStorage.setItem('pendingPayment', JSON.stringify({
          reservationId: data.id,
          bookingCode: data.bookingCode,
          totalPrice: data.totalPrice,
          depositPercentage: 50
        }));

        // BUG FIX: Ruta correcta es /payment-gateway
        navigate('/payment-gateway');
      } else {
        const errData = await res.json();
        setError(errData.message || 'Error al crear la reserva');
      }
    } catch (err) {
      setError('Error de red al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p className="text-white/60">{t("common.loading")}</p>
    </div>
  );

  const nights = calculateDays();
  const total = bookingData.basePrice * nights;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black text-white">
      <Helmet>
        <title>{t('client.checkout_title')} | Hotel Gotitas</title>
        <meta name="description" content="Finaliza tu reserva de manera segura." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-white">{t('client.checkout_title')}</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: booking info */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">{bookingData.categoryName}</h3>
            {bookingData.imageUrl && (
              <img
                src={bookingData.imageUrl}
                alt={bookingData.categoryName}
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
            )}
            <div className="space-y-3 text-white/60">
              <div className="flex items-center gap-2">
                <Calendar className="text-[#eca8d6]" size={18} />
                <span>Check-in: <strong className="text-white">{bookingData.checkIn}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-[#eca8d6]" size={18} />
                <span>Check-out: <strong className="text-white">{bookingData.checkOut}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-[#eca8d6]" size={18} />
                <span>{t('publicRooms.guests')}: <strong className="text-white">{bookingData.capacity}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: summary & pay */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-white">{t('client.account_summary')}</h3>
            <div className="space-y-3 flex-1">
              <div className="flex justify-between text-white/70">
                <span>{t('client.price_per_night')}</span>
                <span>S/ {Number(bookingData.basePrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>{t('client.nights')}</span>
                <span>× {nights}</span>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between font-bold text-xl text-white">
                <span>{t('client.total')}</span>
                <span className="text-[#eca8d6]">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-sm text-white/50">{t('client.redirect_payment')}</p>
              <button 
                onClick={handleConfirmReservation}
                disabled={loading}
                className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-[#eca8d6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('client.processing') : t('client.confirm')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

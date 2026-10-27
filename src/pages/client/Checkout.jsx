import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AlertCircle, ShieldCheck, Lock, Check } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { formatMoney, nightsBetween, usePaymentConfig } from '../../utils/payments';
import MercadoPagoBrick from '../../components/MercadoPagoBrick';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  // Reserva ya creada en este checkout: si falla Mercado Pago, reintentar no crea otra reserva
  const [reservation, setReservation] = useState(null);
  const [option, setOption] = useState('DEPOSIT');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBrick, setShowBrick] = useState(false);
  // Anticipo y Public Key vienen del backend; null = no se pudo cargar
  const config = usePaymentConfig();

  useEffect(() => {
    const data = sessionStorage.getItem('bookingDetails');
    if (!data) {
      navigate('/habitaciones');
      return;
    }
    setBookingData(JSON.parse(data));
    const created = sessionStorage.getItem('checkoutReservation');
    if (created) setReservation(JSON.parse(created));
  }, [navigate]);

  // Crea (una sola vez) la reserva y muestra el formulario de Mercado Pago
  const handleContinue = async () => {
    setLoading(true);
    setError('');
    try {
      let current = reservation;
      if (!current) {
        const res = await apiClient('/client/reservations', {
          method: 'POST',
          body: JSON.stringify({
            categoryId: bookingData.categoryId,
            checkInDate: bookingData.checkIn,
            checkOutDate: bookingData.checkOut,
            guests: Number(bookingData.capacity) || 1,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || t('checkout.create_error'));
        current = data;
        setReservation(data);
        sessionStorage.setItem('checkoutReservation', JSON.stringify(data));
      }
      setShowBrick(true);
    } catch (err) {
      setError(err.message || t('checkout.create_error'));
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData || config === undefined) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-ivory/60">{t('common.loading')}</p>
    </div>
  );

  const nights = nightsBetween(bookingData.checkIn, bookingData.checkOut);
  const total = reservation ? Number(reservation.totalPrice) : bookingData.basePrice * nights;
  const deposit = reservation?.depositAmount != null
    ? Number(reservation.depositAmount)
    : Math.round(total * Number(config?.depositPercentage ?? 100)) / 100;
  const payNow = option === 'DEPOSIT' ? deposit : total;

  const options = [
    { id: 'DEPOSIT', title: t('checkout.option_deposit', { pct: config?.depositPercentage ?? 100 }), amount: deposit, hint: t('checkout.option_deposit_hint', { amount: formatMoney(total - deposit) }) },
    { id: 'FULL', title: t('checkout.option_full'), amount: total, hint: t('checkout.option_full_hint') },
  ];

  const steps = [t('checkout.step_room'), t('checkout.step_payment'), t('checkout.step_done')];

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10 pb-16">
      <Helmet>
        <title>{t('client.checkout_title')} | Hotel Gotitas</title>
      </Helmet>

      <ol className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-label text-ivory/40 mb-10" aria-label={t('client.checkout_title')}>
        {steps.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${i === 0 ? 'bg-sand border-sand text-ink-900' : i === 1 ? 'border-accent text-accent' : 'border-ivory/20'}`}>
              {i === 0 ? <Check size={14} /> : i + 1}
            </span>
            <span className={i === 1 ? 'text-ivory' : ''} aria-current={i === 1 ? 'step' : undefined}>{label}</span>
            {i < steps.length - 1 && <span className="w-8 h-px bg-ivory/15" />}
          </li>
        ))}
      </ol>

      <h1 className="font-display text-5xl md:text-7xl font-medium leading-none mb-10">{t('client.checkout_title')}</h1>

      {error && (
        <div role="alert" className="bg-red-500/10 border border-red-400/30 text-red-200 p-4 rounded-xl mb-8 flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p>{error}</p>
            {reservation && (
              <Link to="/client/reservations" className="underline text-sm">{t('checkout.see_reservation')}</Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-ink-800 mb-8">
            {bookingData.imageUrl && (
              <img src={bookingData.imageUrl} alt={bookingData.categoryName} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/10 to-transparent" />
            <h2 className="absolute bottom-6 left-6 right-6 font-display text-4xl md:text-5xl font-medium">{bookingData.categoryName}</h2>
          </div>

          <h3 className="text-[11px] uppercase tracking-label text-sand mb-4">{t('checkout.how_pay')}</h3>
          <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label={t('checkout.how_pay')}>
            {options.map((o) => {
              const active = option === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setOption(o.id)}
                  className={`text-left rounded-2xl border p-5 transition-colors ${active ? 'border-accent bg-accent/10' : 'border-ivory/10 hover:border-ivory/30'}`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="flex items-center gap-2 font-medium">
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? 'border-accent' : 'border-ivory/30'}`}>
                        {active && <span className="w-2 h-2 rounded-full bg-accent" />}
                      </span>
                      {o.title}
                    </span>
                    <span className="font-display text-2xl font-semibold">{formatMoney(o.amount)}</span>
                  </div>
                  <p className="text-xs text-ivory/50 pl-6">{o.hint}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumen con forma de ticket */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28 h-fit">
          <div className="ticket overflow-visible">
            <div className="p-7">
              <p className="text-[10px] uppercase tracking-label text-ink-900/50 mb-1">{t('client.account_summary')}</p>
              <p className="font-display text-3xl font-semibold mb-6">{bookingData.categoryName}</p>
              <dl className="grid grid-cols-3 gap-4 text-sm">
                <div><dt className="text-[10px] uppercase tracking-label text-ink-900/45">{t('publicRooms.checkin')}</dt><dd className="font-semibold mt-1">{bookingData.checkIn}</dd></div>
                <div><dt className="text-[10px] uppercase tracking-label text-ink-900/45">{t('publicRooms.checkout')}</dt><dd className="font-semibold mt-1">{bookingData.checkOut}</dd></div>
                <div><dt className="text-[10px] uppercase tracking-label text-ink-900/45">{t('publicRooms.guests')}</dt><dd className="font-semibold mt-1">{bookingData.capacity}</dd></div>
              </dl>
            </div>

            <div className="relative border-t-2 border-dashed border-ink-900/15">
              <span aria-hidden="true" className="notch -top-3 -left-3" />
              <span aria-hidden="true" className="notch -top-3 -right-3" />
            </div>

            <div className="p-7 space-y-3 text-sm">
              <div className="flex justify-between text-ink-900/65">
                <span>{formatMoney(bookingData.basePrice)} × {t('publicRooms.nights_count', { count: nights })}</span>
                <span>{formatMoney(total)}</span>
              </div>
              <div className="flex justify-between text-ink-900/65">
                <span>{t('checkout.pay_later')}</span>
                <span>{formatMoney(total - payNow)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-ink-900/10">
                <span className="font-semibold">{t('checkout.pay_now')}</span>
                <span className="font-display text-4xl font-semibold">{formatMoney(payNow)}</span>
              </div>

              <label className="flex items-start gap-3 pt-4 text-ink-900/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#0e0c0b]"
                />
                <span>
                  {t('client.accept_terms')}{' '}
                  <Link to="/terminos" target="_blank" className="underline hover:text-ink-900">{t('footer.terms')}</Link>
                </span>
              </label>

              {showBrick && reservation ? (
                <div className="pt-4">
                  <MercadoPagoBrick
                    reservationId={reservation.id}
                    option={option}
                    amount={payNow}
                    onError={setError}
                  />
                </div>
              ) : (
                <button onClick={handleContinue} disabled={loading || !acceptedTerms || !config?.publicKey} className="btn-dark w-full mt-2 py-4 text-base">
                  <Lock size={16} />
                  {loading ? t('client.processing') : t('checkout.pay_with_mp')}
                </button>
              )}

              <p className="flex items-start gap-2 text-xs text-ink-900/50 pt-1">
                <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                {t('checkout.mp_notice')}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

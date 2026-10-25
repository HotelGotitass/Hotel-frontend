import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../utils/apiClient';
import { formatMoney } from '../../utils/payments';

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 10;

// Mercado Pago vuelve aqui (back_urls) con ?status=approved&external_reference=<bookingCode>&payment_id=...
// La confirmacion real llega por webhook, asi que se consulta la reserva hasta verla actualizada.
export default function PaymentResult() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const mpStatus = params.get('status') || params.get('collection_status');
  const bookingCode = params.get('external_reference');

  const [reservation, setReservation] = useState(null);
  const [phase, setPhase] = useState(mpStatus === 'approved' ? 'verifying' : mpStatus);

  useEffect(() => {
    if (!bookingCode) return;
    let cancelled = false;
    let polls = 0;

    const check = async () => {
      try {
        const res = await apiClient('/client/reservations');
        if (!res.ok) return;
        const found = (await res.json()).find((r) => r.bookingCode === bookingCode);
        if (cancelled || !found) return;
        setReservation(found);
        if (mpStatus === 'approved') {
          if (found.status === 'CONFIRMED' || Number(found.amountPaid) > 0) {
            setPhase('confirmed');
            return;
          }
          if (++polls >= MAX_POLLS) {
            setPhase('approved_pending');
            return;
          }
          setTimeout(check, POLL_INTERVAL_MS);
        }
      } catch {
        /* apiClient ya redirige en 401; otros errores: se muestra el estado de Mercado Pago */
      }
    };
    check();
    return () => { cancelled = true; };
  }, [bookingCode, mpStatus]);

  const views = {
    verifying: { icon: Loader2, color: 'text-accent-deep', spin: true, title: t('paymentResult.verifying_title'), desc: t('paymentResult.verifying_desc') },
    confirmed: { icon: CheckCircle, color: 'text-emerald-700', title: t('paymentResult.success_title'), desc: t('paymentResult.success_desc') },
    approved_pending: { icon: Clock, color: 'text-sand-deep', title: t('paymentResult.approved_pending_title'), desc: t('paymentResult.approved_pending_desc') },
    pending: { icon: Clock, color: 'text-sand-deep', title: t('paymentResult.pending_title'), desc: t('paymentResult.pending_desc') },
    in_process: { icon: Clock, color: 'text-sand-deep', title: t('paymentResult.pending_title'), desc: t('paymentResult.pending_desc') },
  };
  const view = views[phase] || { icon: XCircle, color: 'text-red-700', title: t('paymentResult.error_title'), desc: t('paymentResult.error_desc') };
  const Icon = view.icon;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-5 py-12">
      <div className="ticket max-w-md w-full" role="status" aria-live="polite">
        <div className="p-8 text-center">
          <Icon className={`w-14 h-14 mx-auto mb-6 ${view.color} ${view.spin ? 'animate-spin' : ''}`} strokeWidth={1.5} />
          <h1 className="font-display text-4xl font-semibold mb-3">{view.title}</h1>
          <p className="text-ink-900/60">{view.desc}</p>
        </div>

        {reservation && (
          <>
            <div className="relative border-t-2 border-dashed border-ink-900/15">
              <span aria-hidden="true" className="notch -top-3 -left-3" />
              <span aria-hidden="true" className="notch -top-3 -right-3" />
            </div>
            <dl className="p-8 grid grid-cols-2 gap-5 text-sm">
              <div className="col-span-2">
                <dt className="text-[10px] uppercase tracking-label text-ink-900/45">{t('client.booking_code')}</dt>
                <dd className="font-mono text-2xl font-semibold tracking-wider mt-1">{reservation.bookingCode}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-label text-ink-900/45">{t('client.category')}</dt>
                <dd className="font-medium mt-1">{reservation.categoryName}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-label text-ink-900/45">{t('reservationsPage.paid')}</dt>
                <dd className="font-medium mt-1">{formatMoney(reservation.amountPaid)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[10px] uppercase tracking-label text-ink-900/45">{t('client.dates')}</dt>
                <dd className="font-medium mt-1">{reservation.checkInDate} → {reservation.checkOutDate}</dd>
              </div>
            </dl>
          </>
        )}

        <div className="px-8 pb-8">
          <Link to="/client/reservations" className="btn-dark w-full">{t('paymentResult.go_reservations')}</Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { formatMoney } from '../../utils/payments';
import MercadoPagoBrick from '../../components/MercadoPagoBrick';
import { downloadPdfResponse } from '../../utils/download';
import { Calendar, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Edit2, CreditCard, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STATUS_STYLES = {
  PENDING: { cls: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300', icon: Clock, key: 'status.pending' },
  CONFIRMED: { cls: 'bg-green-500/10 border-green-500/30 text-green-300', icon: CheckCircle, key: 'status.confirmed' },
  CHECKED_IN: { cls: 'bg-blue-500/10 border-blue-500/30 text-blue-300', icon: CheckCircle, key: 'status.checked_in' },
  CHECKED_OUT: { cls: 'bg-purple-500/10 border-purple-500/30 text-purple-300', icon: CheckCircle, key: 'status.checked_out' },
  CANCELLED: { cls: 'bg-red-500/10 border-red-500/30 text-red-300', icon: XCircle, key: 'status.cancelled' },
};

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status];
  if (!style) return <span className="bg-ivory/10 text-ivory/60 px-2 py-1 rounded-full text-xs font-bold">{status}</span>;
  const Icon = style.icon;
  return (
    <span className={`border px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${style.cls}`}>
      <Icon className="w-3 h-3" /> {t(style.key)}
    </span>
  );
}

// El backend envia los segundos restantes (no una hora) para no depender de la zona horaria del navegador
function PaymentCountdown({ seconds, onExpire }) {
  const { t } = useTranslation();
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) {
      onExpire();
      return;
    }
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left, onExpire]);

  const mm = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, '0');
  const ss = String(Math.max(left, 0) % 60).padStart(2, '0');
  return (
    <span className="flex items-center gap-1 text-yellow-300 text-xs">
      <Clock className="w-3.5 h-3.5" /> {t('reservationsPage.pay_within', { time: `${mm}:${ss}` })}
    </span>
  );
}

export default function ClientReservations() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [payingRes, setPayingRes] = useState(null);
  // Opcion elegida en el modal: con ella se muestra el formulario de Mercado Pago
  const [payOption, setPayOption] = useState(null);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedResForModify, setSelectedResForModify] = useState(null);
  const [newDates, setNewDates] = useState({ checkIn: '', checkOut: '' });

  const fetchReservations = useCallback(async () => {
    try {
      const res = await apiClient('/client/reservations');
      if (res.ok) setReservations(await res.json());
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const errorMessage = async (res, fallback) => {
    const data = await res.json().catch(() => ({}));
    return data.message || fallback;
  };

  const handleCancel = async (id) => {
    if (!window.confirm(t('reservations.confirm_cancel'))) return;
    try {
      const res = await apiClient('/client/reservations/' + id + '/cancel', { method: 'POST' });
      if (res.ok) {
        setNotice({ type: 'success', text: t('reservationsPage.cancelled_ok') });
        fetchReservations();
      } else {
        setNotice({ type: 'error', text: await errorMessage(res, t('reservationsPage.cancel_error')) });
      }
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  const handlePay = (reservation, option) => {
    setPayingRes(reservation);
    setPayOption(option);
  };

  const closePayModal = () => {
    setPayingRes(null);
    setPayOption(null);
  };

  const handleDownloadInvoice = async (reservationId) => {
    try {
      const res = await apiClient(`/client/reservations/${reservationId}/invoice/pdf`, { headers: { Accept: 'application/pdf' } });
      if (res.status === 404) {
        setNotice({ type: 'error', text: await errorMessage(res, t('reservationsPage.invoice_missing')) });
        return;
      }
      await downloadPdfResponse(res, `Comprobante_reserva_${reservationId}.pdf`);
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
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
        setNotice({ type: 'success', text: t('reservationsPage.modified_ok') });
        fetchReservations();
      } else {
        setNotice({ type: 'error', text: await errorMessage(res, t('reservationsPage.modify_error')) });
        setShowModifyModal(false);
      }
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-4">
      {[0, 1, 2].map((i) => <div key={i} className="card h-36 animate-pulse" />)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-4xl font-semibold mb-1">{t('client.my_reservations')}</h2>
          <p className="text-ivory/50 text-sm">{t('client.history')}</p>
        </div>
        <Link to="/habitaciones" className="btn-ghost text-sm py-2">{t('reservationsPage.new_booking')}</Link>
      </div>

      {notice && (
        <div
          role="status"
          className={`mb-6 p-4 rounded-xl border flex items-start justify-between gap-3 text-sm ${notice.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-green-500/10 border-green-500/30 text-green-300'}`}
        >
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} aria-label={t('client.btn_cancel')}><X size={16} /></button>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="card p-12 text-center text-ivory/50">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-6">{t('client.no_reservations')}</p>
          <Link to="/habitaciones" className="btn-primary">{t('nav.book')}</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(res => {
            const balance = Number(res.balanceDue || 0);
            const isPending = res.status === 'PENDING';
            const canPayBalance = res.status === 'CONFIRMED' && balance > 0;
            return (
              <div key={res.id} className={`ticket-dark flex flex-col md:flex-row overflow-visible card-hover ${res.status === 'CANCELLED' ? 'opacity-70' : ''}`}>
                <div className="flex-1 min-w-0 p-6 md:p-7 flex flex-col gap-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusBadge status={res.status} />
                    {isPending && res.paymentExpiresInSeconds != null && (
                      <PaymentCountdown seconds={res.paymentExpiresInSeconds} onExpire={fetchReservations} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl font-medium leading-tight">{res.categoryName}</h3>
                    <p className="flex items-center gap-2 text-ivory/55 text-sm mt-2">
                      <Calendar className="w-4 h-4" strokeWidth={1.5} /> {res.checkInDate} → {res.checkOutDate}
                    </p>
                    {res.status === 'CANCELLED' && res.cancellationReason && (
                      <p className="flex items-center gap-2 text-red-300/80 text-sm mt-2">
                        <AlertTriangle className="w-4 h-4" /> {res.cancellationReason}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {isPending && (
                      <button onClick={() => handlePay(res, null)} className="text-sm bg-accent text-black px-3 py-1.5 rounded-lg hover:bg-ivory transition-colors font-semibold flex items-center gap-1">
                        <CreditCard size={14} /> {t('client.pay_now')}
                      </button>
                    )}
                    {canPayBalance && (
                      <button onClick={() => handlePay(res, 'BALANCE')} className="text-sm bg-accent text-black px-3 py-1.5 rounded-lg hover:bg-ivory transition-colors font-semibold flex items-center gap-1 disabled:opacity-50">
                        <CreditCard size={14} /> {t('reservationsPage.pay_balance')}
                      </button>
                    )}
                    {(isPending || res.status === 'CONFIRMED') && res.modificationCount === 0 && (
                      <button onClick={() => handleOpenModify(res)} className="text-sm border border-ivory/15 text-ivory/70 px-3 py-1.5 rounded-lg hover:bg-ivory/5 transition-colors flex items-center gap-1">
                        <Edit2 size={14} /> {t('client.modify')}
                      </button>
                    )}
                    {(isPending || res.status === 'CONFIRMED') && (
                      <button onClick={() => handleCancel(res.id)} className="text-sm border border-red-500/40 text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                        {t('client.cancel')}
                      </button>
                    )}
                    {(res.status === 'CHECKED_IN' || res.status === 'CHECKED_OUT') && (
                      <button onClick={() => handleDownloadInvoice(res.id)} className="text-sm border border-ivory/15 text-ivory/70 px-3 py-1.5 rounded-lg hover:bg-ivory/5 transition-colors flex items-center gap-1">
                        <FileText size={14} /> {t('client.invoice')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Talon: el codigo que se presenta en recepcion */}
                <div className="relative md:w-64 shrink-0 p-6 md:p-7 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-ivory/15 flex flex-col justify-between gap-5">
                  <span aria-hidden="true" className="notch hidden md:block -top-3 -left-3" />
                  <span aria-hidden="true" className="notch hidden md:block -bottom-3 -left-3" />
                  <div>
                    <p className="text-[10px] uppercase tracking-label text-ivory/40">{t('client.booking_code')}</p>
                    <p className="font-mono text-xl font-semibold tracking-wider text-sand mt-1 break-all">{res.bookingCode || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-label text-ivory/40">{t('client.total')}</p>
                    <p className="font-display text-3xl font-semibold">{formatMoney(res.totalPrice)}</p>
                    {Number(res.amountPaid) > 0 && (
                      <p className="text-xs text-ivory/55 mt-1">
                        {t('reservationsPage.paid')} {formatMoney(res.amountPaid)}
                        {balance > 0 && <> · {t('reservationsPage.balance')} {formatMoney(balance)}</>}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal elegir monto a pagar */}
      {payingRes && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-3xl font-semibold mb-1">{t('client.pay_now')}</h3>
            <p className="text-sm text-ivory/50 mb-6">{payingRes.bookingCode} · {payingRes.categoryName}</p>
            {payOption ? (
              <MercadoPagoBrick
                reservationId={payingRes.id}
                option={payOption}
                amount={payOption === 'DEPOSIT' ? Number(payingRes.depositAmount) - Number(payingRes.amountPaid || 0) : Number(payingRes.balanceDue)}
                onError={(text) => setNotice({ type: 'error', text })}
              />
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setPayOption('DEPOSIT')}
                  className="w-full flex justify-between items-center rounded-2xl border border-ivory/10 hover:border-accent p-4 transition-colors"
                >
                  <span className="font-semibold">{t('client.deposit')}</span>
                  <span className="font-bold">{formatMoney(Number(payingRes.depositAmount) - Number(payingRes.amountPaid || 0))}</span>
                </button>
                <button
                  onClick={() => setPayOption('FULL')}
                  className="w-full flex justify-between items-center rounded-2xl border border-ivory/10 hover:border-accent p-4 transition-colors"
                >
                  <span className="font-semibold">{t('checkout.option_full')}</span>
                  <span className="font-bold">{formatMoney(payingRes.balanceDue)}</span>
                </button>
              </div>
            )}
            <p className="text-xs text-ivory/40 mt-4">{t('checkout.mp_notice')}</p>
            <button onClick={closePayModal} className="btn-ghost w-full mt-5 py-2">
              {t('client.btn_cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Modal Modificar Fechas */}
      {showModifyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="card p-6 max-w-md w-full">
            <h3 className="font-display text-3xl font-semibold mb-3">{t('client.modify')}</h3>
            <p className="text-sm text-ivory/50 mb-6">{t('client.modify_info')}</p>
            <form onSubmit={submitModifyDates} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ivory/70 mb-1">{t('client.new_checkin')}</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newDates.checkIn}
                  onChange={e => setNewDates({ ...newDates, checkIn: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ivory/70 mb-1">{t('client.new_checkout')}</label>
                <input
                  type="date"
                  required
                  min={newDates.checkIn}
                  value={newDates.checkOut}
                  onChange={e => setNewDates({ ...newDates, checkOut: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModifyModal(false)} className="btn-ghost py-2">
                  {t('client.btn_cancel')}
                </button>
                <button type="submit" className="btn-accent py-2">
                  {t('client.btn_save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

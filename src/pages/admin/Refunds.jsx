import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../utils/apiClient';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PaymentModal, { REFUND_METHODS } from '../../components/admin/PaymentModal';

export default function Refunds() {
  const { t } = useTranslation();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const res = await apiClient('/admin/refunds');
      if (res.ok) setRefunds(await res.json());
      else console.warn('Refunds endpoint not found or error');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [processing, setProcessing] = useState(null);
  const [notice, setNotice] = useState('');

  // El reembolso en efectivo sale de la caja abierta (egreso); los demas medios no tocan el cajon
  const handleProcessRefund = async ({ method, reference }) => {
    const res = await apiClient(`/admin/refunds/${processing.id}/process`, {
      method: 'POST',
      body: JSON.stringify({ method, reference }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || t('refunds.process_error'));
    setNotice(method === 'CASH'
      ? t('refunds.done_cash', { amount: Number(processing.amount).toFixed(2) })
      : t('refunds.done_other', { method: t(`payments.methods.${method}`) }));
    setProcessing(null);
    fetchRefunds();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('refunds.title')}</h2>
      </div>

      {notice && (
        <div role="status" className="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {notice} <Link to="/admin/caja" className="underline ml-1">{t('cash.title')}</Link>
        </div>
      )}

      <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#161616] border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="p-4">{t('refunds.id')}</th>
              <th className="p-4">{t('refunds.booking_code')}</th>
              <th className="p-4">{t('refunds.amount')}</th>
              <th className="p-4">{t('refunds.reason')}</th>
              <th className="p-4">{t('refunds.status')}</th>
              <th className="p-4">{t('refunds.method')}</th>
              <th className="p-4">{t('refunds.processed_by')}</th>
              <th className="p-4 text-right">{t('refunds.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm">
            {refunds.map(ref => (
              <tr key={ref.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-white/50">{ref.id}</td>
                <td className="p-4 font-mono text-[#eca8d6] font-semibold">{ref.bookingCode}</td>
                <td className="p-4 font-bold text-green-400">S/ {ref.amount?.toFixed(2)}</td>
                <td className="p-4 text-xs text-white/70">{ref.reason}</td>
                <td className="p-4">
                  {ref.status === 'REQUESTED' ? (
                    <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2 py-1 rounded text-xs font-bold flex items-center w-max gap-1">
                      <Clock size={14} /> {t('status.requested')}
                    </span>
                  ) : (
                    <span className="bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-1 rounded text-xs font-bold flex items-center w-max gap-1">
                      <CheckCircle size={14} /> {t('status.processed')}
                    </span>
                  )}
                </td>
                <td className="p-4 text-xs text-white/70">
                  {ref.method ? t(`payments.methods.${ref.method}`) : '-'}
                  {ref.reference && <div className="text-white/40 font-mono">{ref.reference}</div>}
                </td>
                <td className="p-4 text-xs text-white/50">{ref.processedBy || '-'}</td>
                <td className="p-4 text-right">
                  {ref.status === 'REQUESTED' && (
                    <button 
                      onClick={() => { setNotice(''); setProcessing(ref); }}
                      className="bg-[#eca8d6] text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white transition-colors"
                    >
                      {t('refunds.mark_processed')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {refunds.length === 0 && !loading && (
              <tr>
                <td colSpan="8" className="p-12 text-center text-white/50 flex flex-col items-center justify-center">
                  <AlertTriangle size={32} className="mb-3 opacity-40" />
                  {t('refunds.no_refunds')}
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="8" className="p-12 text-center text-white/50">{t('common.loading')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {processing && (
        <PaymentModal
          title={t('refunds.process_title')}
          subtitle={`${processing.bookingCode} · S/ ${Number(processing.amount).toFixed(2)}`}
          editableAmount={false}
          methods={REFUND_METHODS}
          methodLabel={t('refunds.refund_method')}
          submitLabel={t('refunds.mark_processed')}
          hint={(m) => (m === 'CASH' ? t('refunds.hint_cash') : m === 'MERCADO_PAGO' ? t('refunds.hint_mp') : t('refunds.hint_other'))}
          onSubmit={handleProcessRefund}
          onClose={() => setProcessing(null)}
        />
      )}
    </div>
  );
}

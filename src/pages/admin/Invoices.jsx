import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../utils/apiClient';
import { downloadPdfResponse } from '../../utils/download';
import PaymentModal from '../../components/admin/PaymentModal';
import { FileText, Download, CheckCircle, Ban, Info, Search } from 'lucide-react';

// Misma validacion que el backend (digito verificador modulo 11) para avisar antes de enviar
const isValidRuc = (ruc) => {
  if (!/^(10|15|16|17|20)\d{9}$/.test(ruc || '')) return false;
  const w = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = w.reduce((acc, wi, i) => acc + wi * Number(ruc[i]), 0);
  let check = 11 - (sum % 11);
  if (check === 10) check = 0;
  if (check === 11) check = 1;
  return check === Number(ruc[10]);
};

const EMPTY_FORM = {
  reservationId: '', documentType: 'BOLETA',
  customerDocType: '', customerDocNumber: '', customerName: '', customerAddress: '',
};

const inputCls = 'w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/60';

export default function Invoices() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [showEmit, setShowEmit] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [voiding, setVoiding] = useState(null);
  const [voidReason, setVoidReason] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

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
      if (res.ok) setReservations(await res.json());
    } catch (err) { console.error(err); }
  };

  const readError = async (res) => (await res.json().catch(() => ({}))).message || t('common.error');

  // Reservas facturables: no canceladas y sin comprobante vigente
  const billable = useMemo(() => {
    const active = new Set(invoices.filter((i) => i.status !== 'VOID').map((i) => i.reservationId));
    return reservations.filter((r) => r.status !== 'CANCELLED' && !active.has(r.id));
  }, [invoices, reservations]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((inv) => {
      if (filter === 'BOLETA' && inv.documentType !== 'BOLETA') return false;
      if (filter === 'FACTURA' && inv.documentType !== 'FACTURA') return false;
      if (filter === 'VOID' && inv.status !== 'VOID') return false;
      if (!q) return true;
      return [inv.number, inv.customerName, inv.customerDocNumber, inv.bookingCode]
        .some((v) => (v || '').toLowerCase().includes(q));
    });
  }, [invoices, filter, query]);

  const isFactura = form.documentType === 'FACTURA';
  const rucError = isFactura && form.customerDocNumber.length === 11 && !isValidRuc(form.customerDocNumber);

  const handleEmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isFactura && !isValidRuc(form.customerDocNumber)) {
      setError(t('billing.ruc_invalid'));
      return;
    }
    setBusy(true);
    try {
      const body = {
        documentType: form.documentType,
        customerDocType: isFactura ? 'RUC' : form.customerDocType || null,
        customerDocNumber: form.customerDocNumber || null,
        customerName: form.customerName || null,
        customerAddress: form.customerAddress || null,
      };
      const res = await apiClient('/invoices/reservation/' + form.reservationId, { method: 'POST', body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await readError(res));
      const created = await res.json();
      setShowEmit(false);
      setForm(EMPTY_FORM);
      setNotice(created.sunatMessage);
      fetchInvoices();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleVoid = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await apiClient(`/invoices/${voiding.id}/void`, { method: 'PATCH', body: JSON.stringify({ reason: voidReason }) });
      if (!res.ok) throw new Error(await readError(res));
      const updated = await res.json();
      setVoiding(null);
      setVoidReason('');
      setNotice(updated.sunatMessage);
      fetchInvoices();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // "Cobrar": el backend registra el saldo pendiente en la caja abierta con el medio elegido
  const [charging, setCharging] = useState(null);
  const handlePay = async ({ method }) => {
    const res = await apiClient(`/invoices/${charging.id}/pay?method=${method}`, { method: 'PATCH' });
    if (!res.ok) throw new Error(await readError(res));
    setCharging(null);
    setNotice(t('billing.charged', { number: charging.number }));
    fetchInvoices();
  };

  const handleDownloadPdf = async (inv) => {
    try {
      const res = await apiClient(`/invoices/${inv.id}/pdf`, { headers: { Accept: 'application/pdf' } });
      await downloadPdfResponse(res, `${inv.number || 'comprobante-' + inv.id}.pdf`);
    } catch (err) {
      setNotice(err.message || t('invoices.download_error'));
    }
  };

  const statusBadge = (inv) => {
    if (inv.status === 'VOID') return <span className="bg-red-500/15 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full text-xs font-bold">{t('status.void')}</span>;
    if (inv.status === 'PAID') return <span className="bg-green-500/15 text-green-400 border border-green-500/40 px-2 py-0.5 rounded-full text-xs font-bold">{t('status.paid')}</span>;
    return <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/40 px-2 py-0.5 rounded-full text-xs font-bold">{t('status.pending')}</span>;
  };

  const tabs = [
    { id: 'ALL', label: t('billing.tab_all') },
    { id: 'BOLETA', label: t('billing.boletas') },
    { id: 'FACTURA', label: t('billing.facturas') },
    { id: 'VOID', label: t('billing.tab_void') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">{t('billing.title')}</h2>
          <p className="text-sm text-white/50">{t('billing.subtitle')}</p>
        </div>
        <button
          onClick={() => { setError(''); setForm(EMPTY_FORM); setShowEmit(true); }}
          className="flex items-center gap-2 bg-[#eca8d6] text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
        >
          <FileText size={18} /> {t('billing.emit')}
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        <Info size={18} className="shrink-0 mt-0.5" />
        <span>{t('billing.simulated_notice')}</span>
      </div>

      {notice && (
        <div role="status" className="flex justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="text-white/50 hover:text-white">×</button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-sm ${filter === tab.id ? 'bg-white text-black font-semibold' : 'text-white/60 border border-white/10 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <label className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('billing.search')} className={`${inputCls} pl-9 w-80 max-w-full`} />
        </label>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/50 border-b border-white/10">
            <tr className="text-white/70">
              <th className="px-4 py-3 font-semibold">{t('billing.document')}</th>
              <th className="px-4 py-3 font-semibold">{t('billing.customer')}</th>
              <th className="px-4 py-3 font-semibold">{t('invoices.reservation')}</th>
              <th className="px-4 py-3 font-semibold">{t('billing.issued')}</th>
              <th className="px-4 py-3 font-semibold text-right">{t('invoices.total')}</th>
              <th className="px-4 py-3 font-semibold">{t('invoices.status')}</th>
              <th className="px-4 py-3 font-semibold text-right">{t('invoices.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {visible.map((inv) => (
              <tr key={inv.id} className={`hover:bg-white/5 transition-colors ${inv.status === 'VOID' ? 'opacity-60' : ''}`}>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mr-2 ${inv.documentType === 'FACTURA' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/70'}`}>
                    {inv.documentType === 'FACTURA' ? t('billing.factura') : t('billing.boleta')}
                  </span>
                  <span className="font-mono whitespace-nowrap">{inv.number}</span>
                  {inv.creditNoteNumber && (
                    <div className="text-xs text-red-300/80 mt-1">{t('billing.credit_note')}: <span className="font-mono">{inv.creditNoteNumber}</span></div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div>{inv.customerName}</div>
                  <div className="text-xs text-white/50">{inv.customerDocType} {inv.customerDocNumber}</div>
                </td>
                <td className="px-4 py-3 font-mono text-white/70 whitespace-nowrap">{inv.bookingCode}</td>
                <td className="px-4 py-3 text-white/60 whitespace-nowrap">{inv.issueDate ? new Date(inv.issueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
                <td className="px-4 py-3 font-bold text-[#eca8d6] text-right whitespace-nowrap">S/ {Number(inv.totalAmount).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 items-start">
                    {statusBadge(inv)}
                    <span className="text-[11px] text-white/40" title={inv.sunatMessage}>SUNAT: {inv.sunatStatus || '—'} ({t('billing.simulated')})</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {inv.status === 'PENDING' && (
                      <button onClick={() => setCharging(inv)} title={t('billing.mark_paid')} aria-label={t('billing.mark_paid')} className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/40"><CheckCircle size={16} /></button>
                    )}
                    <button onClick={() => handleDownloadPdf(inv)} title={t('billing.download')} aria-label={t('billing.download')} className="p-1.5 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/40"><Download size={16} /></button>
                    {inv.status !== 'VOID' && (
                      <button onClick={() => { setError(''); setVoidReason(''); setVoiding(inv); }} title={t('billing.void')} aria-label={t('billing.void')} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"><Ban size={16} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan="7" className="px-4 py-10 text-center text-white/50">{t('invoices.no_invoices')}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showEmit && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-1">{t('billing.emit')}</h2>
            <p className="text-sm text-white/50 mb-6">{t('invoices.generate_info')}</p>
            {error && <div role="alert" className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleEmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('invoices.select_reservation')}</label>
                <select required value={form.reservationId} onChange={(e) => setForm({ ...form, reservationId: e.target.value })} className={inputCls}>
                  <option value="">{t('invoices.select_reservation_placeholder')}</option>
                  {billable.map((r) => (
                    <option key={r.id} value={r.id}>{r.bookingCode} — {r.guestName} ({r.status})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t('billing.document')}>
                {['BOLETA', 'FACTURA'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={form.documentType === type}
                    onClick={() => setForm({ ...EMPTY_FORM, reservationId: form.reservationId, documentType: type })}
                    className={`rounded-xl border p-3 text-left ${form.documentType === type ? 'border-[#eca8d6] bg-[#eca8d6]/10' : 'border-white/10 hover:border-white/30'}`}
                  >
                    <div className="font-semibold">{type === 'BOLETA' ? t('billing.boleta') : t('billing.factura')}</div>
                    <div className="text-xs text-white/50">{type === 'BOLETA' ? t('billing.boleta_hint') : t('billing.factura_hint')}</div>
                  </button>
                ))}
              </div>

              {isFactura ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">RUC</label>
                    <input required inputMode="numeric" maxLength={11} value={form.customerDocNumber}
                      onChange={(e) => setForm({ ...form, customerDocNumber: e.target.value.replace(/\D/g, '') })}
                      className={`${inputCls} ${rucError ? 'border-red-500/60' : ''}`} placeholder="20XXXXXXXXX" aria-invalid={rucError} />
                    {rucError && <p className="text-xs text-red-400 mt-1">{t('billing.ruc_invalid')}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">{t('billing.business_name')}</label>
                    <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">{t('billing.fiscal_address')}</label>
                    <input required value={form.customerAddress} onChange={(e) => setForm({ ...form, customerAddress: e.target.value })} className={inputCls} />
                  </div>
                </>
              ) : (
                <details className="rounded-xl border border-white/10 p-3">
                  <summary className="cursor-pointer text-sm text-white/70">{t('billing.boleta_override')}</summary>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <select value={form.customerDocType} onChange={(e) => setForm({ ...form, customerDocType: e.target.value })} className={inputCls}>
                      <option value="">{t('billing.from_guest')}</option>
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="PASAPORTE">Pasaporte</option>
                      <option value="RUC">RUC</option>
                    </select>
                    <input value={form.customerDocNumber} onChange={(e) => setForm({ ...form, customerDocNumber: e.target.value })} placeholder={t('billing.doc_number')} className={`${inputCls} col-span-2`} />
                    <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder={t('billing.customer')} className={`${inputCls} col-span-3`} />
                  </div>
                </details>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEmit(false)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5">{t('invoices.cancel')}</button>
                <button type="submit" disabled={busy || rucError} className="bg-[#eca8d6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-white disabled:opacity-50">
                  {busy ? t('client.processing') : t('billing.emit_btn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {charging && (
        <PaymentModal
          title={t('billing.charge_title')}
          subtitle={`${charging.number} · ${charging.customerName} · ${t('billing.charge_hint')}`}
          editableAmount={false}
          onSubmit={handlePay}
          onClose={() => setCharging(null)}
        />
      )}

      {voiding && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-1">{t('billing.void_title')}</h2>
            <p className="text-sm text-white/50 mb-5">
              <span className="font-mono text-white">{voiding.number}</span> · {t('billing.void_info')}
            </p>
            {error && <div role="alert" className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleVoid} className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-white/70 mb-1">{t('billing.void_reason')}</span>
                <textarea required maxLength={255} rows={3} value={voidReason} onChange={(e) => setVoidReason(e.target.value)} className={inputCls} />
              </label>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setVoiding(null)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5">{t('invoices.cancel')}</button>
                <button type="submit" disabled={busy || !voidReason.trim()} className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-400 disabled:opacity-50">
                  {busy ? t('client.processing') : t('billing.void_btn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

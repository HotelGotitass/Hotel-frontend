import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../utils/apiClient';
import { Wallet, Lock, Unlock, ArrowDownCircle, ArrowUpCircle, History, X } from 'lucide-react';

const inputCls = 'w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/60';
const money = (v) => `S/ ${Number(v || 0).toFixed(2)}`;
const when = (d) => (d ? new Date(d).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—');

function DiffBadge({ value }) {
  const n = Number(value || 0);
  if (n === 0) return <span className="text-green-400 font-semibold">{money(0)}</span>;
  return <span className={`font-semibold ${n > 0 ? 'text-amber-300' : 'text-red-400'}`}>{n > 0 ? '+' : ''}{money(n)}</span>;
}

export default function CashRegister() {
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [detail, setDetail] = useState(null);
  const [openingAmount, setOpeningAmount] = useState('');
  const [movement, setMovement] = useState(null);
  const [closing, setClosing] = useState(false);
  const [counted, setCounted] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  // Llega aqui desde "Cerrar sesion" con su caja abierta: debe hacer el arqueo antes de salir
  const location = useLocation();
  const mustClose = Boolean(location.state?.mustClose);

  const readError = async (res) => (await res.json().catch(() => ({}))).message || t('common.error');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cur, hist] = await Promise.all([apiClient('/cash/current'), apiClient('/cash/sessions')]);
      setSession(cur.status === 200 ? await cur.json() : null);
      if (hist.ok) setHistory(await hist.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (mustClose && session && session.status === 'OPEN') {
      setCounted('');
      setNotes('');
      setClosing(true);
    }
  }, [mustClose, session?.id]);

  const post = async (path, body, after) => {
    setBusy(true);
    setError('');
    try {
      const res = await apiClient(path, { method: 'POST', body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await readError(res));
      after?.(await res.json());
      await load();
      // El layout vuelve a evaluar si el recepcionista puede ver el panel o debe abrir caja
      window.dispatchEvent(new Event('cash:changed'));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const openDetail = async (id) => {
    const res = await apiClient(`/cash/sessions/${id}`);
    if (res.ok) setDetail(await res.json());
  };

  if (loading && !session) return <p className="text-white/50">{t('common.loading')}</p>;

  const expectedClose = session ? Number(session.expectedCash) : 0;
  const diff = counted === '' ? null : Number(counted) - expectedClose;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2"><Wallet size={22} /> {t('cash.title')}</h2>
        <p className="text-sm text-white/50">{t('cash.subtitle')}</p>
      </div>

      {mustClose && session && (
        <div role="alert" className="bg-amber-500/10 border border-amber-500/40 text-amber-200 px-4 py-3 rounded-xl text-sm">
          {t('cashGate.must_close')}
        </div>
      )}

      {error && !movement && !closing && (
        <div role="alert" className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      {!session ? (
        <form
          onSubmit={(e) => { e.preventDefault(); post('/cash/open', { openingAmount: Number(openingAmount) }, () => setOpeningAmount('')); }}
          className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><Lock size={18} /></span>
            <div>
              <p className="font-semibold">{t('cash.closed_title')}</p>
              <p className="text-sm text-white/50">{t('cash.closed_desc')}</p>
            </div>
          </div>
          <label className="block mb-4">
            <span className="block text-sm text-white/70 mb-1">{t('cash.opening_amount')}</span>
            <input required type="number" min="0" step="0.01" value={openingAmount} onChange={(e) => setOpeningAmount(e.target.value)} className={`${inputCls} text-lg font-mono`} placeholder="0.00" />
          </label>
          <button disabled={busy} className="flex items-center gap-2 bg-[#eca8d6] text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-white disabled:opacity-50">
            <Unlock size={18} /> {t('cash.open_btn')}
          </button>
        </form>
      ) : (
        <>
          <div className="bg-[#111] border border-green-500/30 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center"><Unlock size={18} /></span>
              <div>
                <p className="font-semibold">{t('cash.open_title')}</p>
                <p className="text-sm text-white/50">{t('cash.opened_by', { user: session.openedBy, time: when(session.openedAt) })}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setError(''); setMovement({ type: 'INCOME', amount: '', concept: '' }); }} className="flex items-center gap-2 border border-white/15 px-4 py-2 rounded-lg text-sm hover:bg-white/5"><ArrowDownCircle size={16} className="text-green-400" /> {t('cash.income')}</button>
              <button onClick={() => { setError(''); setMovement({ type: 'EXPENSE', amount: '', concept: '' }); }} className="flex items-center gap-2 border border-white/15 px-4 py-2 rounded-lg text-sm hover:bg-white/5"><ArrowUpCircle size={16} className="text-red-400" /> {t('cash.expense')}</button>
              <button onClick={() => { setError(''); setCounted(''); setNotes(''); setClosing(true); }} className="flex items-center gap-2 bg-[#eca8d6] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white"><Lock size={16} /> {t('cash.close_btn')}</button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: t('cash.opening_amount'), value: money(session.openingAmount) },
              { label: t('cash.total_income'), value: money(session.totalIncome) },
              { label: t('cash.total_expense'), value: money(session.totalExpense) },
              { label: t('cash.expected_cash'), value: money(session.expectedCash), strong: true },
            ].map((c) => (
              <div key={c.label} className={`rounded-2xl border p-4 ${c.strong ? 'border-[#eca8d6]/40 bg-[#eca8d6]/5' : 'border-white/10 bg-[#111]'}`}>
                <p className="text-xs uppercase tracking-wider text-white/50">{c.label}</p>
                <p className={`text-2xl font-bold mt-1 ${c.strong ? 'text-[#eca8d6]' : ''}`}>{c.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
              <p className="text-sm font-semibold mb-3">{t('cash.by_method')}</p>
              {Object.keys(session.incomeByMethod || {}).length === 0 ? (
                <p className="text-sm text-white/40">{t('cash.no_income')}</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {Object.entries(session.incomeByMethod).map(([m, v]) => (
                    <li key={m} className="flex justify-between"><span className="text-white/70">{t(`payments.methods.${m}`)}</span><span className="font-mono">{money(v)}</span></li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-white/40 mt-4">{t('cash.expected_hint')}</p>
            </div>

            <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
              <p className="text-sm font-semibold px-5 pt-5 pb-3">{t('cash.movements')}</p>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-white/5">
                    {(session.movements || []).slice().reverse().map((m) => (
                      <tr key={m.id}>
                        <td className="px-5 py-2.5 text-white/50 whitespace-nowrap">{when(m.createdAt)}</td>
                        <td className="px-2 py-2.5">{m.concept}<div className="text-xs text-white/40">{t(`payments.methods.${m.method}`)} · {m.createdBy}</div></td>
                        <td className={`px-5 py-2.5 text-right font-mono whitespace-nowrap ${m.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>{m.type === 'INCOME' ? '+' : '−'}{money(m.amount)}</td>
                      </tr>
                    ))}
                    {(session.movements || []).length === 0 && (
                      <tr><td className="px-5 py-8 text-center text-white/40">{t('cash.no_movements')}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-x-auto">
        <p className="text-sm font-semibold px-5 pt-5 pb-3 flex items-center gap-2"><History size={16} /> {t('cash.history')}</p>
        <table className="w-full text-sm">
          <thead className="text-white/50 text-left">
            <tr>
              <th className="px-5 py-2 font-medium">{t('cash.opened')}</th>
              <th className="px-3 py-2 font-medium">{t('cash.closed')}</th>
              <th className="px-3 py-2 font-medium text-right">{t('cash.expected_cash')}</th>
              <th className="px-3 py-2 font-medium text-right">{t('cash.counted')}</th>
              <th className="px-5 py-2 font-medium text-right">{t('cash.difference')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.map((h) => (
              <tr key={h.id} onClick={() => openDetail(h.id)} className="cursor-pointer hover:bg-white/5">
                <td className="px-5 py-2.5">{when(h.openedAt)}<div className="text-xs text-white/40">{h.openedBy}</div></td>
                <td className="px-3 py-2.5">{when(h.closedAt)}<div className="text-xs text-white/40">{h.closedBy}</div></td>
                <td className="px-3 py-2.5 text-right font-mono">{money(h.expectedCash)}</td>
                <td className="px-3 py-2.5 text-right font-mono">{money(h.countedAmount)}</td>
                <td className="px-5 py-2.5 text-right font-mono"><DiffBadge value={h.difference} /></td>
              </tr>
            ))}
            {history.length === 0 && <tr><td colSpan="5" className="px-5 py-8 text-center text-white/40">{t('cash.no_history')}</td></tr>}
          </tbody>
        </table>
      </div>

      {movement && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
          <form
            onSubmit={(e) => { e.preventDefault(); post('/cash/movements', { ...movement, amount: Number(movement.amount), method: 'CASH' }, () => setMovement(null)); }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4"
          >
            <h3 className="text-xl font-bold">{movement.type === 'INCOME' ? t('cash.income_title') : t('cash.expense_title')}</h3>
            {error && <div role="alert" className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">{error}</div>}
            <label className="block">
              <span className="block text-sm text-white/70 mb-1">{t('cash.concept')}</span>
              <input required maxLength={255} value={movement.concept} onChange={(e) => setMovement({ ...movement, concept: e.target.value })} className={inputCls} placeholder={movement.type === 'INCOME' ? t('cash.income_hint') : t('cash.expense_hint')} />
            </label>
            <label className="block">
              <span className="block text-sm text-white/70 mb-1">{t('payments.amount')} (S/) · {t('payments.methods.CASH')}</span>
              <input required type="number" min="0.01" step="0.01" value={movement.amount} onChange={(e) => setMovement({ ...movement, amount: e.target.value })} className={`${inputCls} font-mono`} />
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setMovement(null)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5">{t('invoices.cancel')}</button>
              <button disabled={busy} className="bg-[#eca8d6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-white disabled:opacity-50">{t('cash.save')}</button>
            </div>
          </form>
        </div>
      )}

      {closing && session && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
          <form
            onSubmit={(e) => { e.preventDefault(); post('/cash/close', { countedAmount: Number(counted), notes: notes || null }, (closed) => { setClosing(false); setDetail(closed); }); }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4"
          >
            <h3 className="text-xl font-bold">{t('cash.close_title')}</h3>
            <p className="text-sm text-white/50">{t('cash.close_desc')}</p>
            {error && <div role="alert" className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">{error}</div>}
            <div className="flex justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
              <span className="text-white/60">{t('cash.expected_cash')}</span>
              <span className="font-mono font-semibold">{money(expectedClose)}</span>
            </div>
            <label className="block">
              <span className="block text-sm text-white/70 mb-1">{t('cash.counted')}</span>
              <input required autoFocus type="number" min="0" step="0.01" value={counted} onChange={(e) => setCounted(e.target.value)} className={`${inputCls} text-lg font-mono`} />
            </label>
            {diff !== null && (
              <div className="flex justify-between text-sm px-1">
                <span className="text-white/60">{diff === 0 ? t('cash.balanced') : diff > 0 ? t('cash.surplus') : t('cash.shortage')}</span>
                <DiffBadge value={diff} />
              </div>
            )}
            <label className="block">
              <span className="block text-sm text-white/70 mb-1">{t('cash.notes')}</span>
              <textarea rows={2} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} />
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setClosing(false)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5">{t('invoices.cancel')}</button>
              <button disabled={busy || counted === ''} className="bg-[#eca8d6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-white disabled:opacity-50">{t('cash.confirm_close')}</button>
            </div>
          </form>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{t('cash.report_title')}</h3>
                <p className="text-sm text-white/50">{when(detail.openedAt)} → {when(detail.closedAt)}</p>
              </div>
              <button onClick={() => setDetail(null)} aria-label={t('invoices.cancel')} className="text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm mb-4">
              <dt className="text-white/50">{t('cash.opening_amount')}</dt><dd className="text-right font-mono">{money(detail.openingAmount)}</dd>
              <dt className="text-white/50">{t('cash.total_income')}</dt><dd className="text-right font-mono">{money(detail.totalIncome)}</dd>
              <dt className="text-white/50">{t('cash.total_expense')}</dt><dd className="text-right font-mono">{money(detail.totalExpense)}</dd>
              <dt className="text-white/50">{t('cash.expected_cash')}</dt><dd className="text-right font-mono">{money(detail.expectedCash)}</dd>
              <dt className="text-white/50">{t('cash.counted')}</dt><dd className="text-right font-mono">{money(detail.countedAmount)}</dd>
              <dt className="text-white/50">{t('cash.difference')}</dt><dd className="text-right font-mono"><DiffBadge value={detail.difference} /></dd>
            </dl>
            <p className="text-sm font-semibold mb-2">{t('cash.by_method')}</p>
            <ul className="text-sm space-y-1 mb-4">
              {Object.entries(detail.incomeByMethod || {}).map(([m, v]) => (
                <li key={m} className="flex justify-between"><span className="text-white/60">{t(`payments.methods.${m}`)}</span><span className="font-mono">{money(v)}</span></li>
              ))}
            </ul>
            {detail.notes && <p className="text-sm text-white/60 border-t border-white/10 pt-3">{t('cash.notes')}: {detail.notes}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

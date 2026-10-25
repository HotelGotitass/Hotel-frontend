import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Unlock, ShieldAlert, LogOut } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

const money = (v) => `S/ ${Number(v || 0).toFixed(2)}`;
const when = (d) => (d ? new Date(d).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—');

/**
 * Pantalla previa al panel del recepcionista:
 *  - sin caja abierta: solo "Abrir caja" (y salir)
 *  - caja abierta por otra persona: aviso, no puede trabajar hasta que la cierre quien la abrio o un admin
 */
export default function CashGate({ state, session, onOpened, onLogout }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [lastClose, setLastClose] = useState(null);
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (state !== 'none') return;
    apiClient('/cash/sessions').then(async (res) => {
      if (res.ok) setLastClose((await res.json())[0] || null);
    }).catch(() => {});
  }, [state]);

  const handleOpen = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await apiClient('/cash/open', { method: 'POST', body: JSON.stringify({ openingAmount: Number(amount) }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || t('common.error'));
      onOpened();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <p className="text-center font-bold tracking-wider uppercase text-white/70 mb-8">Gotitas</p>

        {state === 'other' ? (
          <div className="bg-[#111] border border-amber-500/30 rounded-2xl p-7 text-center" role="alert">
            <ShieldAlert size={40} className="mx-auto text-amber-300 mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t('cashGate.other_title')}</h1>
            <p className="text-white/60 text-sm mb-6">
              {t('cashGate.other_desc', { user: session?.openedBy, time: when(session?.openedAt) })}
            </p>
            <button onClick={onLogout} className="inline-flex items-center gap-2 border border-white/15 px-5 py-2.5 rounded-lg text-sm hover:bg-white/5">
              <LogOut size={16} /> {t('admin.logout')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleOpen} className="bg-[#111] border border-white/10 rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-full bg-[#eca8d6]/15 text-[#eca8d6] flex items-center justify-center"><Lock size={20} /></span>
              <div>
                <h1 className="text-2xl font-bold">{t('cashGate.title')}</h1>
                <p className="text-sm text-white/50">{t('cashGate.greeting', { user: email })}</p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-5">{t('cashGate.desc')}</p>

            {error && <div role="alert" className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}

            <label className="block mb-5">
              <span className="block text-sm text-white/70 mb-1">{t('cash.opening_amount')} (S/)</span>
              <input required autoFocus type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-3 text-white text-xl font-mono outline-none focus:border-[#eca8d6]/60" placeholder="0.00" />
            </label>

            <button disabled={busy || amount === ''} className="w-full flex items-center justify-center gap-2 bg-[#eca8d6] text-black py-3 rounded-lg font-semibold hover:bg-white disabled:opacity-50">
              <Unlock size={18} /> {busy ? t('client.processing') : t('cash.open_btn')}
            </button>

            {lastClose && (
              <p className="text-xs text-white/40 mt-5 text-center">
                {t('cashGate.last_close', { user: lastClose.closedBy, time: when(lastClose.closedAt), counted: money(lastClose.countedAmount) })}
              </p>
            )}

            <button type="button" onClick={onLogout} className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-white/50 hover:text-white">
              <LogOut size={15} /> {t('admin.logout')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

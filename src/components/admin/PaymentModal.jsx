import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Banknote, CreditCard, Landmark, Smartphone, Wallet } from 'lucide-react';

export const PAYMENT_METHODS = [
  { id: 'CASH', icon: Banknote },
  { id: 'CREDIT_CARD', icon: CreditCard },
  { id: 'DEBIT_CARD', icon: CreditCard },
  { id: 'TRANSFER', icon: Landmark },
  { id: 'YAPE_PLIN', icon: Smartphone },
];

// Medios para devolver dinero: el efectivo sale de la caja; Mercado Pago se devuelve desde su panel
export const REFUND_METHODS = [
  { id: 'CASH', icon: Banknote },
  { id: 'TRANSFER', icon: Landmark },
  { id: 'YAPE_PLIN', icon: Smartphone },
  { id: 'CREDIT_CARD', icon: CreditCard },
  { id: 'MERCADO_PAGO', icon: Wallet },
];

const inputCls = 'w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/60';

/**
 * Cobro en recepcion. Si `editableAmount` es false el backend calcula el monto (p. ej. saldo del comprobante).
 * onSubmit({ amount, method, reference }) debe devolver una promesa; si falla, se muestra el mensaje.
 */
export default function PaymentModal({ title, subtitle, defaultAmount, maxAmount, editableAmount = true, onSubmit, onClose,
  methods = PAYMENT_METHODS, submitLabel, hint, methodLabel }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(defaultAmount != null ? Number(defaultAmount).toFixed(2) : '');
  const [method, setMethod] = useState('CASH');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSubmit({ amount: editableAmount ? Number(amount) : undefined, method, reference: reference || null });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        {subtitle && <p className="text-sm text-white/50 mb-5">{subtitle}</p>}
        {error && <div role="alert" className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {editableAmount && (
            <label className="block">
              <span className="block text-sm font-medium text-white/70 mb-1">{t('payments.amount')} (S/)</span>
              <input required type="number" min="0.01" step="0.01" max={maxAmount ?? undefined}
                value={amount} onChange={(e) => setAmount(e.target.value)} className={`${inputCls} text-lg font-mono`} />
              {maxAmount != null && <span className="text-xs text-white/40">{t('payments.balance')}: S/ {Number(maxAmount).toFixed(2)}</span>}
            </label>
          )}

          <fieldset>
            <legend className="block text-sm font-medium text-white/70 mb-2">{methodLabel || t('payments.method')}</legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {methods.map(({ id, icon: Icon }) => (
                <button key={id} type="button" role="radio" aria-checked={method === id} onClick={() => { setMethod(id); setError(''); }}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm text-left ${method === id ? 'border-[#eca8d6] bg-[#eca8d6]/10 text-white' : 'border-white/10 text-white/70 hover:border-white/30'}`}>
                  <Icon size={16} /> {t(`payments.methods.${id}`)}
                </button>
              ))}
            </div>
          </fieldset>

          {hint && <p className="text-xs text-white/50">{hint(method)}</p>}

          {method !== 'CASH' && (
            <label className="block">
              <span className="block text-sm font-medium text-white/70 mb-1">{t('payments.reference')}</span>
              <input value={reference} maxLength={100} onChange={(e) => setReference(e.target.value)} placeholder={t('payments.reference_hint')} className={inputCls} />
            </label>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5">{t('invoices.cancel')}</button>
            <button type="submit" disabled={busy} className="bg-[#eca8d6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-white disabled:opacity-50">
              {busy ? t('client.processing') : (submitLabel || t('payments.register'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../utils/apiClient';
import { KeyRound, UserCircle } from 'lucide-react';

const inputCls = 'w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#eca8d6]/60';

export default function Account() {
  const { t } = useTranslation();
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiClient('/account/me').then(async (res) => res.ok && setMe(await res.json()));
  }, []);

  const mismatch = form.confirm && form.newPassword !== form.confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mismatch) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await apiClient('/account/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || t('common.error'));
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      setStatus({ ok: true, text: t('account.changed') });
    } catch (err) {
      setStatus({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-bold">{t('account.title')}</h2>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
        <UserCircle size={40} className="text-white/40" />
        <div>
          <p className="font-semibold">{me?.email || localStorage.getItem('email')}</p>
          <p className="text-sm text-white/50">{me?.role || localStorage.getItem('role')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2"><KeyRound size={18} /> {t('account.change_password')}</h3>
        {status && (
          <div role="status" className={`px-4 py-2 rounded-lg text-sm border ${status.ok ? 'bg-green-500/10 border-green-500/40 text-green-300' : 'bg-red-500/10 border-red-500/40 text-red-300'}`}>
            {status.text}
          </div>
        )}
        <label className="block">
          <span className="block text-sm text-white/70 mb-1">{t('account.current')}</span>
          <input required type="password" autoComplete="current-password" value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className={inputCls} />
        </label>
        <label className="block">
          <span className="block text-sm text-white/70 mb-1">{t('account.new')}</span>
          <input required type="password" autoComplete="new-password" minLength={8} maxLength={72} value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className={inputCls} />
          <span className="text-xs text-white/40">{t('account.rules')}</span>
        </label>
        <label className="block">
          <span className="block text-sm text-white/70 mb-1">{t('account.confirm')}</span>
          <input required type="password" autoComplete="new-password" value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })} className={`${inputCls} ${mismatch ? 'border-red-500/60' : ''}`} aria-invalid={mismatch} />
          {mismatch && <span className="text-xs text-red-400">{t('account.mismatch')}</span>}
        </label>
        <button disabled={busy || mismatch} className="bg-[#eca8d6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-white disabled:opacity-50">
          {busy ? t('client.processing') : t('account.save')}
        </button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const toISO = (d) => d.toISOString().split('T')[0];
const addDays = (iso, n) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

// Buscador con forma de ticket/tarjeta-llave: la identidad visual de la reserva
export default function BookingBar({ initial = {}, className = '' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const today = toISO(new Date());
  const [checkIn, setCheckIn] = useState(initial.checkIn || today);
  const [checkOut, setCheckOut] = useState(initial.checkOut || addDays(today, 1));
  const [guests, setGuests] = useState(initial.guests || 2);

  const handleCheckInChange = (value) => {
    setCheckIn(value);
    if (!checkOut || checkOut <= value) setCheckOut(addDays(value, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/habitaciones?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const fieldCls = 'flex flex-col justify-center gap-1 px-6 py-4 min-w-0';
  const labelCls = 'text-[10px] font-semibold uppercase tracking-label text-ink-900/45';
  const inputCls = 'bg-transparent font-display text-xl lg:text-2xl font-semibold text-ink-900 focus:outline-none w-full';

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={t('publicRooms.searcher')}
      className={`ticket shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.7fr_auto] ${className}`}
    >
      <label className={`${fieldCls} border-b sm:border-r lg:border-b-0 border-ink-900/10`}>
        <span className={labelCls}>{t('publicRooms.checkin')}</span>
        <input type="date" required min={today} value={checkIn} onChange={(e) => handleCheckInChange(e.target.value)} className={inputCls} />
      </label>
      <label className={`${fieldCls} border-b lg:border-b-0 lg:border-r border-ink-900/10`}>
        <span className={labelCls}>{t('publicRooms.checkout')}</span>
        <input type="date" required min={addDays(checkIn, 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={inputCls} />
      </label>
      <label className={`${fieldCls} sm:col-span-2 lg:col-span-1`}>
        <span className={labelCls}>{t('publicRooms.guests')}</span>
        <select value={guests} onChange={(e) => setGuests(e.target.value)} className={`${inputCls} cursor-pointer`}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{t('publicRooms.guests_count', { count: n })}</option>
          ))}
        </select>
      </label>

      {/* Talon perforado */}
      <div className="relative sm:col-span-2 lg:col-span-1 p-3 lg:pl-6 border-t-2 lg:border-t-0 lg:border-l-2 border-dashed border-ink-900/15">
        <span aria-hidden="true" className="notch hidden lg:block -top-3 -left-3" />
        <span aria-hidden="true" className="notch hidden lg:block -bottom-3 -left-3" />
        <button type="submit" className="btn-dark w-full h-full min-h-[56px] px-8 rounded-2xl group">
          {t('publicRooms.search')}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}

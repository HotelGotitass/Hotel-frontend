import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { DEPOSIT_PERCENTAGE } from '../utils/payments';

// Reglas que el backend aplica de verdad (anticipo, ventana de pago, modificacion de fechas)
export default function StayInfo() {
  const { t } = useTranslation();
  const items = [
    { title: t('home.info_hold_t'), desc: t('home.info_hold_d') },
    { title: t('home.info_deposit_t', { pct: DEPOSIT_PERCENTAGE }), desc: t('home.info_deposit_d') },
    { title: t('home.info_secure_t'), desc: t('home.info_secure_d') },
    { title: t('home.info_modify_t'), desc: t('home.info_modify_d') },
  ];

  return (
    <section className="bg-ivory-200 text-ink-900 py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-16">
          <div className="lg:col-span-8">
            <span className="eyebrow text-sand-deep mb-6">
              <span className="section-num text-base normal-case tracking-normal">03</span>
              <span className="w-10 h-px bg-sand-deep/50" />
              {t('home.info_label')}
            </span>
            <h2 className="font-display text-5xl md:text-7xl font-medium leading-[0.95] text-balance">{t('home.info_title')}</h2>
          </div>
          <p className="lg:col-span-4 text-ink-900/60 leading-relaxed">{t('home.info_subtitle')}</p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {items.map(({ title, desc }, i) => (
            <li key={title} className="border-t border-ink-900/20 pt-6">
              <span className="font-display italic text-5xl text-sand-deep leading-none">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-lg font-semibold mt-5 mb-2">{title}</h3>
              <p className="text-sm text-ink-900/60 leading-relaxed">{desc}</p>
            </li>
          ))}
        </ol>

        <Link to="/habitaciones" className="btn-dark mt-16 group">
          {t('nav.book')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

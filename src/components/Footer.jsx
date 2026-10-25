import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const colTitle = 'text-[11px] font-medium uppercase tracking-label text-sand mb-5';
  // inline-block + py-2: area de toque comoda en movil sin cambiar el ritmo visual
  const linkCls = 'inline-block py-2 text-ivory/65 hover:text-ivory transition-colors';

  return (
    <footer className="bg-ink-950 text-ivory border-t border-ivory/10">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
        <div className="py-20 lg:py-28 grid lg:grid-cols-12 gap-8 items-end border-b border-ivory/10">
          <h2 className="lg:col-span-8 font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.92] text-balance">
            {t('footer.cta_title')}
          </h2>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Link to="/habitaciones" className="btn-accent px-8 py-4 text-base group">
              {t('nav.book')} <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="py-14 grid grid-cols-2 md:grid-cols-12 gap-10 text-sm">
          <div className="col-span-2 md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <img src="/logo.png" alt="" className="h-7 object-contain" />
              <span className="font-display text-2xl font-semibold tracking-[0.12em] uppercase">Gotitas</span>
            </Link>
            <p className="text-ivory/55 max-w-sm leading-relaxed">{t('footer.desc')}</p>
            <p className="mt-6 text-xs text-ivory/40">{t('footer.payments')}</p>
          </div>

          <div className="md:col-span-3">
            <h4 className={colTitle}>{t('footer.explore')}</h4>
            <ul className="space-y-1">
              <li><Link to="/habitaciones" className={linkCls}>{t('nav.rooms')}</Link></li>
              <li><Link to="/#experiencia" className={linkCls}>{t('nav.experience')}</Link></li>
              <li><Link to="/client/reservations" className={linkCls}>{t('nav.my_reservations')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className={colTitle}>{t('footer.contact')}</h4>
            <ul className="space-y-1">
              <li><a href="mailto:info@hotelgotitas.com" className={linkCls}>info@hotelgotitas.com</a></li>
              <li><a href="tel:+51987654321" className={linkCls}>+51 987 654 321</a></li>
              <li><Link to="/libro-reclamaciones" className={linkCls}>{t('footer.complaints')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-ivory/10 flex flex-col md:flex-row gap-4 justify-between text-xs text-ivory/40">
          <span>&copy; {new Date().getFullYear()} Hotel Gotitas. {t('footer.rights')}</span>
          <div className="flex gap-6">
            <Link to="/terminos" className="inline-block py-2 hover:text-ivory transition-colors">{t('footer.terms')}</Link>
            <Link to="/privacidad" className="inline-block py-2 hover:text-ivory transition-colors">{t('footer.privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll del body con el menu movil abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isEn = i18n.language?.startsWith('en');
  const accountLink = user
    ? (user.role === 'CLIENT'
        ? { to: '/client/reservations', label: t('nav.my_reservations') }
        : { to: '/admin/recepcion', label: t('nav.admin_panel') })
    : { to: '/login', label: t('nav.login') };

  const linkCls = ({ isActive }) =>
    `relative text-[13px] tracking-wide transition-colors ${isActive ? 'text-ivory' : 'text-ivory/65 hover:text-ivory'}`;

  const LangSwitch = ({ className = '' }) => (
    <div className={`flex items-center gap-1 text-xs ${className}`} role="group" aria-label="Idioma / Language">
      {['es', 'en'].map((lng) => {
        const active = lng === 'en' ? isEn : !isEn;
        return (
          <button
            key={lng}
            onClick={() => i18n.changeLanguage(lng)}
            aria-pressed={active}
            className={`w-8 h-8 rounded-full uppercase transition-colors ${active ? 'bg-ivory/10 text-ivory font-semibold' : 'text-ivory/50 hover:text-ivory'}`}
          >
            {lng}
          </button>
        );
      })}
    </div>
  );

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${isScrolled || mobileOpen ? 'glass-nav py-3' : 'bg-gradient-to-b from-ink-900/70 to-transparent py-5'}`}>
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/habitaciones" className={linkCls}>{t('nav.rooms')}</NavLink>
          <Link to="/#experiencia" className="text-[13px] tracking-wide text-ivory/65 hover:text-ivory transition-colors">
            {t('nav.experience')}
          </Link>
        </div>
        <button
          className="md:hidden justify-self-start w-11 h-11 -ml-2 flex items-center justify-center text-ivory"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? t('nav.close_menu') : t('nav.open_menu')}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex items-center gap-2.5 justify-self-center" onClick={() => setMobileOpen(false)}>
          <img src="/logo.png" alt="" className="h-7 object-contain" />
          <span className="font-display text-2xl font-semibold tracking-[0.12em] text-ivory uppercase">Gotitas</span>
        </Link>

        <div className="flex items-center justify-end gap-2 md:gap-5">
          <LangSwitch className="hidden md:flex" />
          <NavLink to={accountLink.to} className={(s) => `hidden md:block ${linkCls(s)}`}>{accountLink.label}</NavLink>
          {user && (
            <button onClick={logout} className="hidden md:block text-[13px] text-ivory/50 hover:text-accent transition-colors">
              {t('nav.logout')}
            </button>
          )}
          <Link to="/habitaciones" className="btn-primary min-h-[40px] py-2 px-5 text-[13px]">
            {t('nav.book')}
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[68px] bottom-0 bg-ink-900 px-6 py-10 flex flex-col animate-fade-up">
          <div className="flex flex-col gap-1">
            {[
              { to: '/habitaciones', label: t('nav.rooms') },
              { to: '/#experiencia', label: t('nav.experience') },
              accountLink,
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="font-display text-4xl py-3 border-b border-ivory/10 text-ivory"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between">
            <LangSwitch />
            {user && (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-accent min-h-[44px]">
                {t('nav.logout')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

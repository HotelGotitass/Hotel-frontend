import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Hotel } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className={"fixed w-full z-50 transition-all duration-500 " + (isScrolled ? 'glass-nav py-4 bg-black/90 shadow-md border-b border-white/10' : 'bg-transparent py-6')}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3"><img src="/logo.png" alt="Gotitas Logo" className="h-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              GOTITAS
            </span>
          </Link>
          
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/#experiencia" className="text-sm text-white/80 hover:text-white transition-colors">
              {t('nav.experience')}
            </Link>
            <Link to="/habitaciones" className="text-sm text-white/80 hover:text-white transition-colors">
              {t('nav.rooms')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Language switcher */}
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <button
                onClick={() => changeLanguage('es')}
                className={i18n.language === 'es' ? 'text-white font-bold' : 'hover:text-white transition-colors'}
              >
                ES
              </button>
              <span>|</span>
              <button
                onClick={() => changeLanguage('en')}
                className={i18n.language.startsWith('en') ? 'text-white font-bold' : 'hover:text-white transition-colors'}
              >
                EN
              </button>
            </div>
            
            {/* Auth links */}
            {user ? (
              <>
                {user.role === 'CLIENT' ? (
                  <Link to="/client/reservations" className="text-sm text-white/80 hover:text-white transition-colors hidden md:block">
                    {t('nav.my_reservations')}
                  </Link>
                ) : (
                  <Link to="/admin/recepcion" className="text-sm text-white/80 hover:text-white transition-colors hidden md:block">
                    {t('nav.admin_panel')}
                  </Link>
                )}
                <button onClick={logout} className="text-sm text-red-300 hover:text-red-100 transition-colors">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="hidden md:block text-sm text-white/80 hover:text-white transition-colors">
                {t('nav.login')}
              </Link>
            )}
            
            <Link to="/habitaciones" className="px-6 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors">
              {t('nav.book')}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white/80 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 flex flex-col gap-3">
            <Link to="/#experiencia" className="text-sm text-white/80" onClick={() => setMobileOpen(false)}>
              {t('nav.experience')}
            </Link>
            <Link to="/habitaciones" className="text-sm text-white/80" onClick={() => setMobileOpen(false)}>
              {t('nav.rooms')}
            </Link>
            {user ? (
              <>
                {user.role === 'CLIENT' ? (
                  <Link to="/client/reservations" className="text-sm text-white/80" onClick={() => setMobileOpen(false)}>
                    {t('nav.my_reservations')}
                  </Link>
                ) : (
                  <Link to="/admin/recepcion" className="text-sm text-white/80" onClick={() => setMobileOpen(false)}>
                    {t('nav.admin_panel')}
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-red-300 text-left">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-white/80" onClick={() => setMobileOpen(false)}>
                {t('nav.login')}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

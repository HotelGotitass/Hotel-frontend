import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { CalendarCheck, User, LogOut, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function ClientDashboardLayout() {
  const location = useLocation();
  const { t } = useTranslation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/client/reservations', label: t('nav.my_reservations', 'Mis Reservas'), icon: CalendarCheck },
    { path: '/client/profile', label: t('nav.my_profile', 'Mis Datos Personales'), icon: User }
  ];

  return (
    <div className="min-h-screen bg-ink-900 text-ivory md:flex">
      {/* Desktop: barra lateral. Movil: cabecera con pestanas */}
      <aside className="md:w-64 md:min-h-screen md:border-r border-b md:border-b-0 border-ivory/10 bg-ink-950 flex md:flex-col shrink-0">
        <div className="px-5 md:px-6 py-4 md:py-6 flex items-center justify-between md:border-b border-ivory/10 flex-1 md:flex-none">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-7 object-contain" />
            <span className="font-display text-xl font-semibold tracking-[0.12em] uppercase">Gotitas</span>
          </Link>
          <button onClick={() => logout()} className="md:hidden w-11 h-11 flex items-center justify-center text-ivory/60" aria-label={t('admin.logout', 'Salir de mi cuenta')}>
            <LogOut size={18} />
          </button>
        </div>

        <nav className="hidden md:block flex-1 p-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${isActive ? 'bg-ivory text-ink-900 font-semibold' : 'text-ivory/60 hover:text-ivory hover:bg-ivory/5'}`}
              >
                <Icon size={18} strokeWidth={1.75} /> {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block p-4 border-t border-ivory/10 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-ivory/60 hover:text-ivory hover:bg-ivory/5 transition-colors">
            <ArrowLeft size={18} /> {t('client.back_to_site', 'Volver a la web')}
          </Link>
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-accent hover:bg-accent/10 transition-colors">
            <LogOut size={18} /> {t('admin.logout', 'Salir de mi cuenta')}
          </button>
        </div>
      </aside>

      <nav className="md:hidden flex gap-2 px-5 py-3 border-b border-ivory/10 overflow-x-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <Link key={path} to={path} aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2 px-4 min-h-[40px] rounded-full text-sm whitespace-nowrap ${isActive ? 'bg-ivory text-ink-900 font-semibold' : 'text-ivory/60 border border-ivory/15'}`}>
              <Icon size={16} /> {label}
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 min-w-0">
        <div className="px-5 py-8 md:p-10 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

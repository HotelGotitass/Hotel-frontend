import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import CashGate from '../../components/admin/CashGate';
import { Search, LayoutDashboard, BedDouble, Tags, Users, LogOut, CalendarCheck, Coffee, FileText, UserCog, Star, Undo2, BookOpen, Wallet, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();

  const allNavItems = [
    { path: '/admin/recepcion', label: t('admin.reception'), icon: <Search size={20} /> },
    { path: '/admin/caja', label: t('cash.title'), icon: <Wallet size={20} /> },
    { path: '/admin/dashboard', label: t('admin.dashboard'), icon: <LayoutDashboard size={20} /> },
    { path: '/admin/habitaciones', label: t('admin.rooms'), icon: <BedDouble size={20} /> },
    { path: '/admin/categorias', label: t('admin.categories'), icon: <Tags size={20} /> },
    { path: '/admin/huespedes', label: t('admin.guests'), icon: <Users size={20} /> },
    { path: '/admin/reservas', label: t('admin.reservations'), icon: <CalendarCheck size={20} /> },
    { path: '/admin/servicios', label: t('admin.extra_services'), icon: <Coffee size={20} /> },
    { path: '/admin/facturas', label: t('admin.invoices'), icon: <FileText size={20} /> },
    { path: '/admin/personal', label: t('admin.staff'), icon: <UserCog size={20} /> },
    { path: '/admin/comodidades', label: t('admin.amenities'), icon: <Star size={20} /> },
    { path: '/admin/reembolsos', label: t('admin.refunds'), icon: <Undo2 size={20} /> },
    { path: '/admin/reclamaciones', label: t('admin.complaints') || 'Libro de Reclamaciones', icon: <BookOpen size={20} /> }
  ];

  const handleLogout = () => { logout(); };

  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');
  // Estas secciones llaman endpoints solo-ADMIN; el recepcionista no las ve
  const ADMIN_ONLY = ['/admin/personal', '/admin/categorias', '/admin/comodidades', '/admin/habitaciones'];
  const navItems = role === 'ADMIN' ? allNavItems : allNavItems.filter((i) => !ADMIN_ONLY.includes(i.path));

  // ---- Caja del recepcionista: el estado real vive en el servidor (sobrevive a cerrar la pestaña)
  const isReceptionist = role === 'RECEPCIONISTA';
  const [cash, setCash] = useState({ state: isReceptionist ? 'loading' : 'skip', session: null });

  const checkCash = useCallback(async () => {
    if (!isReceptionist) return;
    try {
      const res = await apiClient('/cash/current');
      if (res.status === 204) {
        setCash({ state: 'none', session: null });
      } else if (res.ok) {
        const session = await res.json();
        const mine = session.openedBy?.toLowerCase() === (email || '').toLowerCase();
        setCash({ state: mine ? 'mine' : 'other', session });
      }
    } catch {
      /* sin conexion se mantiene el ultimo estado conocido */
    }
  }, [isReceptionist, email]);

  useEffect(() => { checkCash(); }, [checkCash, location.pathname]);

  useEffect(() => {
    window.addEventListener('cash:changed', checkCash);
    window.addEventListener('focus', checkCash);
    return () => {
      window.removeEventListener('cash:changed', checkCash);
      window.removeEventListener('focus', checkCash);
    };
  }, [checkCash]);

  // Prevencion: con su caja abierta, el navegador pide confirmar antes de cerrar o recargar la pestaña
  useEffect(() => {
    if (cash.state !== 'mine') return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [cash.state]);

  if (cash.state === 'loading') {
    return <div className="min-h-screen bg-black text-white/50 flex items-center justify-center">{t('common.loading')}</div>;
  }
  if (cash.state === 'none' || cash.state === 'other') {
    return (
      <CashGate
        state={cash.state}
        session={cash.session}
        onOpened={async () => { await checkCash(); navigate('/admin/recepcion'); }}
        onLogout={logout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#050505] flex flex-col flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <span className="font-bold text-lg tracking-wider uppercase">Gotitas</span>
        </div>
        
        <div className="p-4 flex-grow overflow-y-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-white/30 uppercase tracking-wider mb-4 px-3">
            <LayoutDashboard size={14} /> {t('admin.panel')}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={"flex items-center gap-3 px-3 py-3 rounded-lg transition-all " + (isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white')}
                >
                  <span className={isActive ? 'text-[#eca8d6]' : ''}>{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#eca8d6]/20 flex items-center justify-center text-[#eca8d6] font-bold text-xs">
              {role === 'ADMIN' ? 'AD' : 'RE'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{role?.replace('ROLE_', '') || 'Usuario'}</span>
              {email && <span className="text-xs text-white/40 truncate">{email}</span>}
            </div>
          </div>
          <Link
            to="/admin/cuenta"
            className={"w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-lg transition-colors text-sm " + (location.pathname === '/admin/cuenta' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white')}
          >
            <Settings size={16} /> {t('account.title')}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 mt-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/50 hover:text-white"
          >
            <LogOut size={16} /> {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


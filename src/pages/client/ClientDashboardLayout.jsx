import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarCheck, User, LogOut, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function ClientDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/client/reservations', label: t('nav.my_reservations', 'Mis Reservas'), icon: <CalendarCheck size={20} /> },
    { path: '/client/profile', label: t('nav.my_profile', 'Mis Datos Personales'), icon: <User size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar para cliente */}
      <aside className="w-64 border-r border-white/10 bg-[#050505] flex flex-col flex-shrink-0 min-h-screen">
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
             <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
             <span className="font-bold text-lg tracking-wider uppercase text-white hover:text-[#eca8d6] transition-colors">Gotitas</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#eca8d6] text-black font-semibold shadow-[0_0_15px_rgba(236,168,214,0.3)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all mb-2">
            <ArrowLeft size={20} /> Volver a la web
          </Link>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all font-medium"
          >
            <LogOut size={20} /> {t('admin.logout', 'Salir de mi cuenta')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0a0a0a]">
        <div className="p-8 max-w-6xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
}

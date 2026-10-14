import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { BedDouble, DollarSign, CalendarClock, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiClient('/dashboard');
      if (res.ok) setStats(await res.json());
    } catch (err) { console.error(err); }
  };

  if (!stats) return (
    <div className="text-center text-white/50 pt-20">{t('dashboard.loading')}</div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">{t('dashboard.title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Ocupación */}
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-900/10 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-400 text-sm font-semibold mb-1">{t('dashboard.occupancy')}</p>
              <h3 className="text-4xl font-bold text-white">{stats.occupancyRate}%</h3>
              <p className="text-xs text-white/50 mt-2">
                {stats.occupiedRooms} {t('dashboard.of_rooms', { total: stats.totalRooms })}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Activity size={24} /></div>
          </div>
        </div>

        {/* Ingresos hoy */}
        <div className="bg-gradient-to-br from-green-900/50 to-green-900/10 border border-green-500/30 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-400 text-sm font-semibold mb-1">{t('dashboard.revenue_today')}</p>
              {/* BUG FIX: stats.todayRevenue ahora se muestra correctamente */}
              <h3 className="text-4xl font-bold text-white">
                S/ {stats.todayRevenue != null ? Number(stats.todayRevenue).toFixed(2) : '0.00'}
              </h3>
              <p className="text-xs text-white/50 mt-2">{t('dashboard.revenue_desc')}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><DollarSign size={24} /></div>
          </div>
        </div>

        {/* Reservas activas */}
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-900/10 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-400 text-sm font-semibold mb-1">{t('dashboard.active_reservations')}</p>
              <h3 className="text-4xl font-bold text-white">{stats.activeReservations}</h3>
              <p className="text-xs text-white/50 mt-2">{t('dashboard.active_desc')}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><CalendarClock size={24} /></div>
          </div>
        </div>

        {/* Check-ins pendientes */}
        <div className="bg-gradient-to-br from-orange-900/50 to-orange-900/10 border border-orange-500/30 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-400 text-sm font-semibold mb-1">{t('dashboard.pending_checkins')}</p>
              <h3 className="text-4xl font-bold text-white">{stats.pendingCheckIns}</h3>
              <p className="text-xs text-white/50 mt-2">{t('dashboard.checkins_desc')}</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400"><BedDouble size={24} /></div>
          </div>
        </div>

      </div>

      <div className="mt-8 bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold mb-2">{t('dashboard.system_ok')}</h3>
        <p className="text-white/50">{t('dashboard.system_desc')}</p>
      </div>
    </div>
  );
}

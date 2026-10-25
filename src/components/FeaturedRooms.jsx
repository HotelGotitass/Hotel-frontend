import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, BedDouble } from 'lucide-react';
import { apiClient } from '../utils/apiClient';
import { formatMoney } from '../utils/payments';
import { AmenityIcon } from '../utils/amenityIcons';

function RoomTile({ cat, large, t }) {
  return (
    <Link to="/habitaciones" className="group flex flex-col h-full">
      <div className={`relative overflow-hidden rounded-2xl bg-ivory-200 ${large ? 'aspect-[4/5] lg:aspect-auto lg:flex-1 lg:min-h-[560px]' : 'aspect-[4/3]'}`}>
        {cat.imageUrl ? (
          <img
            src={cat.imageUrl}
            alt={cat.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1.2s] ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-900/20">
            <BedDouble size={56} />
          </div>
        )}
        <span className="absolute top-4 right-4 w-11 h-11 rounded-full bg-ivory/90 text-ink-900 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="flex items-start justify-between gap-4 pt-5">
        <div className="min-w-0">
          <h3 className={`font-display font-semibold text-ink-900 leading-tight ${large ? 'text-4xl' : 'text-3xl'}`}>{cat.name}</h3>
          <p className="text-sm text-ink-900/55 mt-1">{t('publicRooms.max_persons', { count: cat.maxCapacity })}</p>
          {cat.amenities?.length > 0 && (
            <ul className="flex flex-wrap gap-3 mt-3 text-ink-900/60" aria-label={t('publicRooms.amenities')}>
              {[...cat.amenities].slice(0, 5).map((a) => (
                <li key={a.id} title={a.name} className="flex items-center gap-1 text-xs">
                  <AmenityIcon icon={a.icon} size={15} className="text-sand-deep" />
                  <span className="sr-only sm:not-sr-only">{a.name}</span>
                </li>
              ))}
              {cat.amenities.length > 5 && <li className="text-xs">+{cat.amenities.length - 5}</li>}
            </ul>
          )}
        </div>
        <div className="text-right shrink-0">
          <span className="block text-[10px] uppercase tracking-label text-ink-900/45">{t('home.from')}</span>
          <span className="font-display text-2xl font-semibold text-ink-900">{formatMoney(cat.basePrice)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedRooms() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient('/categories')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCategories(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  // Sin categorias (API caida o catalogo vacio) la seccion no se muestra: la landing sigue completa
  if (!loading && categories.length === 0) return null;

  const [first, ...rest] = categories;

  return (
    <section className="bg-ivory text-ink-900 py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-14 lg:mb-20">
          <div className="lg:col-span-7">
            <span className="eyebrow text-sand-deep mb-6">
              <span className="section-num text-base normal-case tracking-normal">01</span>
              <span className="w-10 h-px bg-sand-deep/50" />
              {t('home.rooms_label')}
            </span>
            <h2 className="font-display text-5xl md:text-7xl font-medium leading-[0.95] text-balance">
              {t('home.rooms_title')}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <Link to="/habitaciones" className="btn-ghost-dark">
              {t('home.rooms_cta')} <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-12 gap-8" aria-busy="true">
            <div className="lg:col-span-7 aspect-[4/5] lg:aspect-auto lg:min-h-[560px] rounded-2xl bg-ivory-200 animate-pulse" />
            <div className="lg:col-span-5 grid gap-8">
              <div className="aspect-[4/3] rounded-2xl bg-ivory-200 animate-pulse" />
              <div className="aspect-[4/3] rounded-2xl bg-ivory-200 animate-pulse" />
            </div>
          </div>
        ) : rest.length === 0 ? (
          <div className="max-w-3xl"><RoomTile cat={first} large t={t} /></div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-x-8 gap-y-14">
            <div className="lg:col-span-7">
              <RoomTile cat={first} large t={t} />
            </div>
            <div className="lg:col-span-5 grid gap-14">
              {rest.map((cat) => <RoomTile key={cat.id} cat={cat} t={t} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

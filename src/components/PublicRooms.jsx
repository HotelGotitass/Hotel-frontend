import { apiClient } from '../utils/apiClient';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BedDouble, Users, Moon, ArrowRight, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BookingBar from './BookingBar';
import { formatMoney, nightsBetween } from '../utils/payments';
import { AmenityIcon } from '../utils/amenityIcons';

export default function PublicRooms() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // La busqueda vive en la URL: se puede compartir, recargar y viene prellenada desde el Hero
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = Number(searchParams.get('guests') || 1);
  const hasSearched = Boolean(checkIn && checkOut);
  const nights = nightsBetween(checkIn, checkOut);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (!hasSearched) return;
    setLoading(true);
    setSearchError('');
    apiClient(`/rooms/search?checkIn=${checkIn}&checkOut=${checkOut}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || t('publicRooms.search_error'));
        return data;
      })
      .then((data) => setCategories(data.filter((cat) => cat.maxCapacity >= guests && cat.availableRooms > 0)))
      .catch((err) => {
        setCategories([]);
        setSearchError(err.message === 'Failed to fetch' ? t('publicRooms.search_error') : err.message);
      })
      .finally(() => setLoading(false));
  }, [checkIn, checkOut, guests, hasSearched, t]);

  const handleReservar = (cat) => {
    sessionStorage.setItem('bookingDetails', JSON.stringify({
      checkIn,
      checkOut,
      capacity: guests,
      categoryId: cat.categoryId,
      categoryName: cat.name,
      basePrice: cat.basePrice,
      imageUrl: cat.imageUrl,
    }));
    navigate('/checkout');
  };

  const StateBox = ({ icon: Icon, children, tone = 'muted' }) => (
    <div className={`flex flex-col items-center justify-center text-center py-24 border-t border-ink-900/15 ${tone === 'error' ? 'text-red-800' : 'text-ink-900/50'}`}>
      <Icon size={40} strokeWidth={1.25} className="mb-5" />
      <div className="max-w-md">{children}</div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{t('nav.rooms')} | Hotel Gotitas</title>
      </Helmet>

      <section className="bg-ink-900 pt-12 pb-16 lg:pb-20">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <span className="eyebrow text-sand mb-6">
            <span className="w-10 h-px bg-sand/60" />
            {t('publicRooms.label')}
          </span>
          <h1 className="font-display text-6xl md:text-8xl font-medium leading-[0.9] mb-12">{t('nav.rooms')}</h1>
          <BookingBar key={`${checkIn}-${checkOut}-${guests}`} initial={hasSearched ? { checkIn, checkOut, guests } : {}} />
        </div>
      </section>

      <section className="bg-ivory text-ink-900 min-h-[50vh] py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          {loading ? (
            <div className="space-y-12" aria-busy="true" aria-label={t('publicRooms.loading')}>
              {[0, 1].map((i) => (
                <div key={i} className="grid lg:grid-cols-12 gap-8 border-t border-ink-900/15 pt-10">
                  <div className="lg:col-span-5 aspect-[4/3] rounded-2xl bg-ivory-200 animate-pulse" />
                  <div className="lg:col-span-7 space-y-4">
                    <div className="h-10 w-1/2 rounded bg-ivory-200 animate-pulse" />
                    <div className="h-4 w-full rounded bg-ivory-200 animate-pulse" />
                    <div className="h-4 w-2/3 rounded bg-ivory-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchError ? (
            <StateBox icon={AlertCircle} tone="error">
              <p className="font-display text-3xl mb-2">{searchError}</p>
              <p className="text-sm text-ink-900/50">{t('publicRooms.retry_hint')}</p>
            </StateBox>
          ) : hasSearched && categories.length === 0 ? (
            <StateBox icon={BedDouble}>
              <p className="font-display text-3xl text-ink-900 mb-2">{t('publicRooms.no_rooms')}</p>
              <p className="text-sm">{t('publicRooms.no_rooms_hint')}</p>
            </StateBox>
          ) : hasSearched ? (
            <>
              <p className="text-[11px] uppercase tracking-label text-ink-900/50 mb-8">
                {t('publicRooms.results', { count: categories.length, nights })}
              </p>
              <div>
                {categories.map((cat, idx) => (
                  <article key={cat.categoryId} className="grid lg:grid-cols-12 gap-8 lg:gap-12 border-t border-ink-900/15 py-10 lg:py-14">
                    <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden rounded-2xl bg-ivory-200">
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt={cat.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-ink-900/20"><BedDouble size={56} /></div>
                      )}
                      <span className="absolute top-4 left-4 section-num text-xl bg-ivory/90 rounded-full w-11 h-11 flex items-center justify-center">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="lg:col-span-7 flex flex-col">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight">{cat.name}</h2>
                        {cat.availableRooms <= 2 && (
                          <span className="text-[11px] uppercase tracking-label px-3 py-1.5 rounded-full bg-accent/25 text-accent-deep font-semibold">
                            {t('publicRooms.last_rooms', { count: cat.availableRooms })}
                          </span>
                        )}
                      </div>
                      <p className="text-ink-900/60 leading-relaxed mt-4 max-w-xl">{cat.description}</p>
                      {cat.amenities?.length > 0 && (
                        <ul className="flex flex-wrap gap-2 mt-5" aria-label={t('publicRooms.amenities')}>
                          {cat.amenities.map((a) => (
                            <li key={a.id} className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-ivory-100 px-3 py-1.5 text-xs text-ink-900/75">
                              <AmenityIcon icon={a.icon} size={14} className="text-sand-deep" /> {a.name}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex flex-wrap gap-6 text-sm text-ink-900/55 mt-6">
                        <span className="flex items-center gap-2"><Users size={16} strokeWidth={1.5} /> {t('publicRooms.max_persons', { count: cat.maxCapacity })}</span>
                        <span className="flex items-center gap-2"><Moon size={16} strokeWidth={1.5} /> {t('publicRooms.nights_count', { count: nights })}</span>
                      </div>

                      <div className="mt-auto pt-10 flex flex-wrap items-end justify-between gap-6">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-display text-5xl font-semibold">{formatMoney(cat.basePrice)}</span>
                            <span className="text-sm text-ink-900/50">{t('publicRooms.per_night')}</span>
                          </div>
                          <div className="text-sm text-ink-900/60 mt-1">
                            {t('publicRooms.total_stay')}: <strong className="text-ink-900">{formatMoney(cat.basePrice * nights)}</strong>
                          </div>
                        </div>
                        <button onClick={() => handleReservar(cat)} className="btn-dark px-8 group">
                          {t('publicRooms.book')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <StateBox icon={BedDouble}>
              <p className="font-display text-3xl text-ink-900">{t('publicRooms.select_dates')}</p>
            </StateBox>
          )}
        </div>
      </section>
    </>
  );
}

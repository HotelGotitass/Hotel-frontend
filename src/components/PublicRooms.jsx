import { apiClient } from '../utils/apiClient';
import React, { useState, useEffect } from 'react';
import TranslatedText from './TranslatedText';
import { Helmet } from 'react-helmet';
import { BedDouble, Users, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function PublicRooms() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Helper para texto según idioma
  const getTranslated = (esText, enText) => {
    if (i18n.language.startsWith('en') && enText) {
      return enText;
    }
    return esText;
  };

  // Search state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleReservar = (cat) => {
    // BUG FIX: La clave era 'bookingData' en PublicRooms pero Checkout.jsx la leía como 'bookingDetails'
    // Ahora ambos usan 'bookingDetails'
    sessionStorage.setItem('bookingDetails', JSON.stringify({
      checkIn,
      checkOut,
      capacity,
      categoryId: cat.categoryId,
      categoryName: getTranslated(cat.name, cat.nameEn),
      basePrice: cat.basePrice,
      imageUrl: cat.imageUrl
    }));
    navigate('/checkout');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    
    setLoading(true);
    setHasSearched(true);
    setSearchError('');

    // BUG FIX: URL correcta es /rooms/search?checkIn=...&checkOut=... (sin /public/search)
    apiClient(`/rooms/search?checkIn=${checkIn}&checkOut=${checkOut}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al buscar disponibilidad');
        return res.json();
      })
      .then(data => {
        // Filtrar por capacidad en frontend
        const filtered = data.filter(cat => cat.maxCapacity >= parseInt(capacity));
        setCategories(filtered);
      })
      .catch(err => {
        console.error(err);
        setSearchError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <section className="bg-black relative z-10 min-h-screen">
      <Helmet>
        <title>{t('nav.rooms')} | Hotel Gotitas</title>
      </Helmet>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12 pt-28">
          <h1 className="text-5xl font-bold text-white mb-4 animate-text-glow">{t('nav.rooms')}</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 pb-20">
          
          {/* Search Sidebar */}
          <aside className="lg:w-1/3 shrink-0">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 sticky top-28 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">{t("publicRooms.searcher")}</h3>
              
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">{t("publicRooms.checkin")}</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="date" 
                      required
                      value={checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">{t("publicRooms.checkout")}</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="date" 
                      required
                      value={checkOut}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">{t("publicRooms.guests")}</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="number" 
                      min="1"
                      required
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-white/90 transition-colors">
                  {t("publicRooms.search")}
                </button>
              </form>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-white/60 text-lg animate-pulse">{t("publicRooms.loading")}</div>
              </div>
            ) : searchError ? (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl">
                {searchError}
              </div>
            ) : hasSearched && categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-white/40">
                <BedDouble size={48} className="mb-4 opacity-50" />
                <p className="text-lg">{t("publicRooms.no_rooms")}</p>
              </div>
            ) : hasSearched ? (
              <div className="grid gap-6">
                {categories.map((cat, idx) => (
                  <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row hover:border-white/20 transition-all">
                    {cat.imageUrl && (
                      <div className="md:w-56 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                        <img
                          src={cat.imageUrl}
                          alt={getTranslated(cat.name, cat.nameEn)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h4 className="text-2xl font-bold text-white mb-2">
                          {getTranslated(cat.name, cat.nameEn)}
                        </h4>
                        <p className="text-white/60 text-sm line-clamp-2 mb-4">
                          {getTranslated(cat.description, cat.descriptionEn)}
                        </p>
                        <div className="flex gap-4 text-sm text-white/40">
                          <span className="flex items-center gap-1">
                            <Users size={14}/> {t('publicRooms.max_persons', { count: cat.maxCapacity })}
                          </span>
                          <span className="flex items-center gap-1">
                            <BedDouble size={14}/> {cat.availableRooms} {cat.availableRooms === 1 ? 'disponible' : 'disponibles'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-6">
                        <div>
                          <span className="text-white text-3xl font-bold">
                            S/ {cat.basePrice?.toFixed ? cat.basePrice.toFixed(2) : cat.basePrice}
                          </span>
                          <span className="text-sm font-normal text-white/40 ml-1">{t('publicRooms.per_night')}</span>
                        </div>
                        <button
                          onClick={() => handleReservar(cat)}
                          className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-[#eca8d6] transition-colors"
                        >
                          {t('publicRooms.book')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-white/40">
                <BedDouble size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-center">{t("publicRooms.select_dates")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

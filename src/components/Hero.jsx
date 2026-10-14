import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-black"
    >
      {/* Background Video with complex overlays */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover object-center opacity-50"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40 pointer-events-none">
        <div className="lg:max-w-[65%] pointer-events-auto">
          
          <div className="mb-12">
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-tighter text-white animate-text-glow">
              <span className="block text-white/70">{t('hero.welcome')}</span>
              <span className="block">{t('hero.hotel')}</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl font-light mb-12">
            {t('hero.desc')}
          </p>

          <div className="flex items-center gap-4">
            <Link to="/habitaciones" className="inline-block px-8 py-4 bg-white text-black rounded-full font-medium text-sm hover:bg-white/90 transition-all pointer-events-auto">
              {t('hero.explore')}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom right stats overlay */}
      <div className="absolute bottom-12 right-6 lg:right-12 z-10 hidden md:flex flex-row gap-8 lg:gap-12 pointer-events-none">
        <div className="flex flex-col gap-1 items-end">
          <span className="text-3xl lg:text-4xl font-bold text-white">5★</span>
          <span className="text-xs text-white/50 uppercase tracking-widest">{t('hero.rating')}</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="text-3xl lg:text-4xl font-bold text-white">24/7</span>
          <span className="text-xs text-white/50 uppercase tracking-widest">{t('hero.service')}</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="text-3xl lg:text-4xl font-bold text-white">100%</span>
          <span className="text-xs text-white/50 uppercase tracking-widest">{t('hero.satisfaction')}</span>
        </div>
      </div>
    </section>
  );
}

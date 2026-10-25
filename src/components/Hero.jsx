import React from 'react';
import { useTranslation } from 'react-i18next';
import BookingBar from './BookingBar';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-ink-950">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-60 animate-slow-zoom"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/45 to-ink-950/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/30 via-transparent to-ink-900" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 lg:px-10 pt-36 pb-12 lg:pb-16">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 animate-fade-up">
            <span className="eyebrow text-sand mb-8">
              <span className="w-10 h-px bg-sand/70" />
              {t('hero.eyebrow')}
            </span>
            <h1 className="font-display font-medium leading-[0.88] tracking-[-0.01em] text-ivory text-[clamp(3.4rem,9vw,8.5rem)] text-balance">
              <span className="block italic text-ivory/75">{t('hero.welcome')}</span>
              <span className="block">{t('hero.hotel')}</span>
            </h1>
          </div>
          <p className="lg:col-span-4 lg:pb-4 text-base md:text-lg text-ivory/65 font-light leading-relaxed max-w-md animate-fade-up [animation-delay:120ms]">
            {t('hero.desc')}
          </p>
        </div>

        <BookingBar className="mt-12 lg:mt-16 animate-fade-up [animation-delay:240ms]" />
      </div>
    </section>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, Coffee, Wind, Tv } from 'lucide-react';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    { number: 'i', name: t('features.f_01_t'), description: t('features.f_01_d'), icon: Wifi },
    { number: 'ii', name: t('features.f_02_t'), description: t('features.f_02_d'), icon: Coffee },
    { number: 'iii', name: t('features.f_03_t'), description: t('features.f_03_d'), icon: Wind },
    { number: 'iv', name: t('features.f_04_t'), description: t('features.f_04_d'), icon: Tv },
  ];

  return (
    <section id="experiencia" className="relative bg-ink-900 text-ivory py-24 lg:py-36 scroll-mt-20">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <span className="eyebrow text-sand mb-6">
              <span className="section-num text-base normal-case tracking-normal">02</span>
              <span className="w-10 h-px bg-sand/50" />
              {t('features.f_label')}
            </span>
            <h2 className="font-display text-5xl md:text-7xl font-medium leading-[0.95] text-balance">
              {t('features.f_title1')}{' '}
              <span className="italic text-ivory/45">{t('features.f_title2')}</span>
            </h2>
            <p className="mt-8 text-lg text-ivory/55 leading-relaxed max-w-md">{t('features.f_subtitle')}</p>
          </div>
        </div>

        <ul className="lg:col-span-7 border-t border-ivory/10">
          {features.map(({ number, name, description, icon: Icon }) => (
            <li
              key={number}
              className="group grid grid-cols-[3rem_1fr_auto] md:grid-cols-[4.5rem_1fr_auto] items-start gap-4 md:gap-6 py-9 border-b border-ivory/10"
            >
              <span className="section-num text-3xl leading-none pt-1">{number}</span>
              <div>
                <h3 className="font-display text-3xl md:text-4xl font-medium mb-3 group-hover:text-accent transition-colors duration-300">{name}</h3>
                <p className="text-ivory/55 leading-relaxed max-w-lg">{description}</p>
              </div>
              <span className="w-12 h-12 rounded-full border border-ivory/15 flex items-center justify-center text-ivory/60 group-hover:border-accent group-hover:text-accent transition-colors duration-300">
                <Icon size={20} strokeWidth={1.5} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

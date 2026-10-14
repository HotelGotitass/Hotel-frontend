import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, Coffee, Wind, Tv } from 'lucide-react';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    { number: '01', name: t('features.f_01_t'), description: t('features.f_01_d'), icon: Wifi },
    { number: '02', name: t('features.f_02_t'), description: t('features.f_02_d'), icon: Coffee },
    { number: '03', name: t('features.f_03_t'), description: t('features.f_03_d'), icon: Wind },
    { number: '04', name: t('features.f_04_t'), description: t('features.f_04_d'), icon: Tv },
  ];

  return (
    <section id="servicios" className="relative py-24 lg:py-40 bg-black text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-white/40 mb-6">
              <span className="w-12 h-px bg-white/20"></span>
              {t('features.f_label')}
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-[100px] font-bold tracking-tight leading-[0.9]">
              {t('features.f_title1')} <br/>
              <span className="text-white/30">{t('features.f_title2')}</span>
            </h2>
          </div>
          <div className="lg:col-span-4 flex items-end pb-4">
            <p className="text-xl text-white/50 leading-relaxed">
              {t('features.f_subtitle')}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group relative p-8 lg:p-10 border border-white/10 bg-[#050505] card-hover cursor-default">
                <div className="flex items-center justify-between mb-12">
                  <span className="text-3xl font-mono text-white/10 group-hover:text-[#eca8d6] transition-colors duration-500">
                    {feature.number}
                  </span>
                  <div className="w-10 h-10 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{feature.name}</h3>
                <p className="text-white/50 leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated bottom border on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#eca8d6] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

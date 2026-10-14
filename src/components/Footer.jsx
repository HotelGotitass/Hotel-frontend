import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-900 text-white/60 py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">GOTITAS</h3>
            <p className="text-sm">{t("footer.desc")}</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terminos" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/privacidad" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/libro-reclamaciones" className="hover:text-white transition-colors">{t('footer.complaints')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm">
              <li>info@hotelgotitas.com</li>
              <li>+51 987 654 321</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} Hotel Gotitas. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}

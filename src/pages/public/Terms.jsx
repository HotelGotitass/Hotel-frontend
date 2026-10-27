import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LegalPage from '../../components/legal/LegalPage';
import { buildTerms } from '../../content/legal/terms';
import { buildTermsEn } from '../../content/legal/terms.en';
import { usePaymentConfig } from '../../utils/payments';

export default function Terms() {
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  // Anticipo y ventana de pago salen del backend para que el texto coincida con lo que se cobra
  const config = usePaymentConfig();
  const doc = useMemo(() => {
    const params = {
      depositPercentage: config ? Number(config.depositPercentage) : null,
      paymentWindowMinutes: config?.paymentWindowMinutes ?? null,
    };
    return isEn ? buildTermsEn(params) : buildTerms(params);
  }, [config, isEn]);

  return <LegalPage doc={doc} number="01" path="/terminos" />;
}

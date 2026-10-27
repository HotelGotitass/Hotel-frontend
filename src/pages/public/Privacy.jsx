import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalPage from '../../components/legal/LegalPage';
import { buildPrivacy } from '../../content/legal/privacy';
import { buildPrivacyEn } from '../../content/legal/privacy.en';

const docs = { es: buildPrivacy(), en: buildPrivacyEn() };

export default function Privacy() {
  const { i18n } = useTranslation();
  const doc = i18n.language?.startsWith('en') ? docs.en : docs.es;
  return <LegalPage doc={doc} number="02" path="/privacidad" />;
}

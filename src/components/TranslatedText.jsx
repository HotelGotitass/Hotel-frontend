import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Cache simple en memoria para evitar repetir llamadas a la API
const translationCache = {};

export default function TranslatedText({ text, className }) {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    // Si el texto está vacío o el idioma es español, no traducir
    if (!text) {
      setTranslated('');
      return;
    }
    
    if (i18n.language.startsWith('es')) {
      setTranslated(text);
      return;
    }

    const targetLang = i18n.language.split('-')[0]; // ej: 'en'
    const cacheKey = `${text}_${targetLang}`;

    if (translationCache[cacheKey]) {
      setTranslated(translationCache[cacheKey]);
      return;
    }

    let isMounted = true;
    
    const fetchTranslation = async () => {
      try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLang}`);
        const data = await res.json();
        
        if (data.responseData?.translatedText && isMounted) {
          const result = data.responseData.translatedText;
          translationCache[cacheKey] = result;
          setTranslated(result);
        }
      } catch (err) {
        console.error("Translation error", err);
        if (isMounted) setTranslated(text); // Fallback al texto original
      }
    };

    fetchTranslation();

    return () => { isMounted = false; };
  }, [text, i18n.language]);

  return <span className={className}>{translated}</span>;
}

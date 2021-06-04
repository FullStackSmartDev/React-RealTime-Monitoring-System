import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './de.json';
import en from './en.json';
import pl from './pl.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, de, pl },
    fallbackLng: 'pl',
    defaultNS: 'common',
    fallbackNS: ['common', 'enum'],
    debug: true,
    interpolation: { escapeValue: false },
  });

export default i18n;

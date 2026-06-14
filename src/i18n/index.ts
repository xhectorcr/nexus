import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';
import qu from './locales/qu.json';

const messages = {
  en,
  es,
  qu
};

// Obtener idioma preferido o por defecto
const getBrowserLang = () => {
  const savedLang = localStorage.getItem('nexus_lang');
  if (savedLang && ['en', 'es', 'qu'].includes(savedLang)) {
    return savedLang;
  }
  const browserLang = navigator.language.split('-')[0];
  if (['en', 'es', 'qu'].includes(browserLang)) {
    return browserLang;
  }
  return 'es'; // Fallback a español
};

const i18n = createI18n({
  legacy: false, // Requerido para Composition API
  locale: getBrowserLang(),
  fallbackLocale: 'es',
  messages,
});

export default i18n;

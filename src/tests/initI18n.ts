import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common from '../locales/fi/common.json';
const translations = { common };

i18n.use(initReactI18next).init({
  lng: 'fi',
  fallbackLng: 'fi',
  resources: {
    fi: {
      ...translations,
    },
  },
});

export default i18n;

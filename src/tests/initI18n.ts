import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common from '../locales/fi/common.json';
import footer from '../locales/fi/footer.json';

const translations = { common, footer };

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

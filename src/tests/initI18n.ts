import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common from '../../public/static/locales/fi/common.json';
import event from '../../public/static/locales/fi/event.json';
import events from '../../public/static/locales/fi/events.json';
import footer from '../../public/static/locales/fi/footer.json';
import header from '../../public/static/locales/fi/header.json';

const translations = { common, event, events, footer, header };

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

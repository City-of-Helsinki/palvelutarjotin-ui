import i18n from 'i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import { initReactI18next } from 'react-i18next';

import common from '../../public/locales/fi/common.json';
import enrolment from '../../public/locales/fi/enrolment.json';
import event from '../../public/locales/fi/event.json';
import events from '../../public/locales/fi/events.json';
import footer from '../../public/locales/fi/footer.json';
import form from '../../public/locales/fi/form.json';
import header from '../../public/locales/fi/header.json';
import newsletter from '../../public/locales/fi/newsletter.json';
import occurrence from '../../public/locales/fi/occurrence.json';

const translations = {
  common,
  event,
  events,
  footer,
  header,
  enrolment,
  occurrence,
  form,
  newsletter,
};

i18n.use(intervalPlural);
i18n.use(initReactI18next).init({
  lng: 'fi',
  fallbackLng: 'fi',
  returnNull: false,
  resources: {
    fi: translations,
  },
});

export default i18n;

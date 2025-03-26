import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { Notification } from '../../generated/graphql-cms';
import { fakeDivisions } from '../../utils/usMockDataUtils';

const divisionNames = [
  'Eira',
  'Etu-töölö',
  'Haaga',
  'Hermanni',
  'Herttoniemi',
  'Karhusaari',
  'Kulosaari',
  'Lauttasaari',
  'Mustikkamaa-korkeasaari',
  'Talosaari',
  'Vartiosaari',
  'Vuosaari',
];

const handlers: Parameters<typeof setupServer> = [
  graphql.query('AdministrativeDivisions', () => {
    return HttpResponse.json({
      data: {
        administrativeDivisions: fakeDivisions(divisionNames),
      },
    });
  }),
  graphql.query('Notification', () => {
    const notification: Notification = {
      __typename: 'Notification',
      title: 'MSW mock for notification',
      content: 'Content of MSW notification mock',
      level: 'info',
      linkUrl: '#',
    };
    return HttpResponse.json({
      data: {
        notification,
      },
    });
  }),
];

export { handlers };

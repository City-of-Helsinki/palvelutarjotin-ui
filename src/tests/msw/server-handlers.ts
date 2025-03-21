import { graphql } from 'msw';
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
  graphql.query('AdministrativeDivisions', (req, res, ctx) => {
    return res(
      ctx.data({
        administrativeDivisions: fakeDivisions(divisionNames),
      })
    );
  }),
  graphql.query('Notification', (req, res, ctx) => {
    const notification: Notification = {
      __typename: 'Notification',
      title: 'MSW mock for notification',
      content: 'Content of MSW notification mock',
      level: 'info',
      linkUrl: '#',
    };
    return res(
      ctx.data({
        notification,
      })
    );
  }),
];

export { handlers };

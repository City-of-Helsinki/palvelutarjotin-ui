import { graphql } from 'msw';
import { setupServer } from 'msw/node';

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
];

export { handlers };

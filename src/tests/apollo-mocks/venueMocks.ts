import { MockedResponse } from '@apollo/client/testing';

import { VenueDocument, VenueNode } from '../../generated/graphql';
import { fakeVenue } from '../../utils/mockDataUtils';

export const createVenueQueryMock = (
  overrides: Partial<VenueNode> & { id: VenueNode['id'] }
): MockedResponse => ({
  request: {
    query: VenueDocument,
    variables: {
      id: overrides.id,
    },
  },
  result: {
    data: {
      venue: fakeVenue(overrides),
    },
  },
});

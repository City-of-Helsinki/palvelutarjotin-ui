import { MockedResponse } from '@apollo/client/testing';

import { Event, EventDocument } from '../../generated/graphql';
import { fakeEvent } from '../../utils/mockDataUtils';

export const createDefaultEventQueryMock = ({
  include = [],
  result,
}: {
  include?: string[];
  result: Partial<Event> & { id: Event['id'] };
}): MockedResponse => ({
  request: {
    query: EventDocument,
    variables: {
      id: result.id,
      include: ['keywords', 'location'].concat(include),
      upcomingOccurrencesOnly: true,
    },
  },
  result: {
    data: {
      event: fakeEvent(result),
    },
  },
});

export const createEventQueryMock = (
  result: Partial<Event> & { id: Event['id'] }
): MockedResponse => createDefaultEventQueryMock({ result });

export const createEventQueryMockIncludeLanguageAndAudience = (
  result: Partial<Event> & { id: Event['id'] }
): MockedResponse =>
  createDefaultEventQueryMock({ result, include: ['audience', 'in_language'] });

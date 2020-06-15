import React, { ReactElement } from 'react';

import { EventsQuery } from '../../../generated/graphql';

interface Props {
  eventsData: EventsQuery;
}

const EventList = ({ eventsData }: Props): ReactElement => {
  const events = eventsData.events.data || [];
  const count = eventsData.events.meta.count;
  return <div>{count}</div>;
};

export default EventList;

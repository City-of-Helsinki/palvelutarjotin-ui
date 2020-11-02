import React, { ReactElement } from 'react';

import { fakeEvent } from '../../../utils/mockDataUtils';
import EventCard from './EventCard';

const event = fakeEvent();

export default {
  title: 'EventCard',
  component: EventCard,
};

export const Event = (): ReactElement => (
  <div style={{ backgroundColor: '#eeeeee', padding: '2rem' }}>
    <EventCard
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      event={{ event }}
    />
  </div>
);

import React from 'react';

import { COMMON_I18N_NAMESPACES } from '../constants';
import EventsPage from '../domain/events/EventsPage';

const Events = (): React.ReactElement => <EventsPage />;

Events.getInitialProps = async () => ({
  namespacesRequired: [...COMMON_I18N_NAMESPACES, 'events'],
});

export default Events;

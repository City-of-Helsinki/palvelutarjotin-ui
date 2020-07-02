import React from 'react';

import { COMMON_I18N_NAMESPACES } from '../constants';
import EventsPage from '../domain/events/EventsPage';
import { RouteComponent } from '../types';

const Events: RouteComponent = () => <EventsPage />;

Events.getInitialProps = async () => ({
  namespacesRequired: [...COMMON_I18N_NAMESPACES, 'events', 'event'],
});

export default Events;

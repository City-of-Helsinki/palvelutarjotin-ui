import React from 'react';

import { COMMON_I18N_NAMESPACES } from '../../../constants';
import EventPage from '../../../domain/event/EventPage';
import { RouteComponent } from '../../../types';

const Event: RouteComponent = () => <EventPage />;

Event.getInitialProps = async () => ({
  namespacesRequired: [
    ...COMMON_I18N_NAMESPACES,
    'event',
    'enrolment',
    'form',
    'occurrence',
  ],
});

export default Event;

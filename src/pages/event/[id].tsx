import React from 'react';

import { COMMON_I18N_NAMESPACES } from '../../constants';
import EventPage from '../../domain/event/EventPage';

const Event = (): React.ReactElement => <EventPage />;

Event.getInitialProps = async () => ({
  namespacesRequired: [...COMMON_I18N_NAMESPACES, 'event'],
});

export default Event;

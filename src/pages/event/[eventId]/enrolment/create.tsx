import React from 'react';

import { COMMON_I18N_NAMESPACES } from '../../../../constants';
import CreateEnrolmentPage from '../../../../domain/enrolment/CreateEnrolmentPage';
import { RouteComponent } from '../../../../types';

const Event: RouteComponent = () => <CreateEnrolmentPage />;

Event.getInitialProps = async () => ({
  namespacesRequired: [...COMMON_I18N_NAMESPACES, 'enrolment'],
});

export default Event;

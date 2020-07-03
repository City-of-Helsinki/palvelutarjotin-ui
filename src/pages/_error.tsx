import React from 'react';

import { COMMON_I18N_NAMESPACES } from '../constants';
import NotFoundPage from '../domain/notFoundPage/NotFoundPage';
import { RouteComponent } from '../types';

const Error: RouteComponent = () => <NotFoundPage />;

Error.getInitialProps = async () => ({
  namespacesRequired: [...COMMON_I18N_NAMESPACES],
});

export default Error;

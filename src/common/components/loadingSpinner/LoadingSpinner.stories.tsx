import React, { ReactElement } from 'react';

import LoadingSpinner from './LoadingSpinner';

export default {
  title: 'LoadingSpinner',
  component: LoadingSpinner,
};

export const Loading = (): ReactElement => <LoadingSpinner isLoading />;

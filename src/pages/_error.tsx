import * as Sentry from '@sentry/nextjs';
import { NextPage, NextPageContext } from 'next';
import Error from 'next/error';
import React from 'react';

import NotFoundPage from '../domain/notFoundPage/NotFoundPage';

interface ErrorPageProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

const Error_: NextPage<ErrorPageProps> = ({ hasGetInitialPropsRun, err }) => {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err);
  }

  return <NotFoundPage />;
};

Error_.getInitialProps = async (contextData: NextPageContext) => {
  const errorInitialProps = await Error.getInitialProps(contextData);

  // Only capture when there is an actual error. Calling captureUnderscoreErrorException
  // with a falsy error causes the Sentry SDK to synthesise a spurious
  // "_error.js called with falsy error (undefined)" event (e.g. when the
  // Sentry tunnel route /monitoring fails with a network error and Next.js
  // routes to _error without a real exception).
  if (contextData.err) {
    await Sentry.captureUnderscoreErrorException(contextData);
  }

  return {
    ...errorInitialProps,
    hasGetInitialPropsRun: true,
  };
};

export default Error_;

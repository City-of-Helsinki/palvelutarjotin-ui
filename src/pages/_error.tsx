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

  await Sentry.captureUnderscoreErrorException(contextData);

  return {
    ...errorInitialProps,
    hasGetInitialPropsRun: true,
  };
};

export default Error_;

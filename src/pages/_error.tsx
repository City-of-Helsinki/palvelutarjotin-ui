import { NextPage, NextPageContext } from 'next';
import React from 'react';

import NotFoundPage from '../domain/notFoundPage/NotFoundPage';
import getLocalizationProps from '../utils/getLocalizationProps';

const Error: NextPage = () => <NotFoundPage />;

Error.getInitialProps = async ({ locale }: NextPageContext) =>
  getLocalizationProps(locale ?? 'fi');

export default Error;

import { NextPage, NextPageContext } from 'next';
import React from 'react';

import SubscribeNewsletterPage from '../../domain/newsletter/SubscribeNewsletterPage';
import NotFoundPage from '../../domain/notFoundPage/NotFoundPage';
import { isFeatureEnabled } from '../../utils/featureFlags';
import getLocalizationProps from '../../utils/getLocalizationProps';

const SubscribeNewsLetter: NextPage = () =>
  isFeatureEnabled('NEWSLETTER') ? (
    <SubscribeNewsletterPage />
  ) : (
    <NotFoundPage />
  );

SubscribeNewsLetter.getInitialProps = async ({ locale }: NextPageContext) =>
  getLocalizationProps(locale);

export default SubscribeNewsLetter;

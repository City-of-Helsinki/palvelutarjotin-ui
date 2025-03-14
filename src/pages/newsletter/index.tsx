import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import React from 'react';

import { CommonPropsService } from '../../domain/app/ssr/serverSidePropsService';
import SubscribeNewsletterPage from '../../domain/newsletter/SubscribeNewsletterPage';
import NotFoundPage from '../../domain/notFoundPage/NotFoundPage';
import { isFeatureEnabled } from '../../utils/featureFlags';

const SubscribeNewsLetter: NextPage = () =>
  isFeatureEnabled('NEWSLETTER') ? (
    <SubscribeNewsletterPage />
  ) : (
    <NotFoundPage />
  );

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  // eslint-disable-next-line no-console
  console.debug(
    'Executing getStaticProps of the newsletter page',
    '/pages/newsletter/index.tsx'
  );
  return {
    ...(await CommonPropsService.getCommonStaticProps(context)),
    revalidate: 60 * 60, // Once in an hour
  };
};

export default SubscribeNewsLetter;

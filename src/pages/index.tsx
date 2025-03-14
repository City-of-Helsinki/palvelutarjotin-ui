import { NextPage, GetStaticProps, GetStaticPropsContext } from 'next';
import React from 'react';

import { CommonPropsService } from '../domain/app/ssr/serverSidePropsService';
import EventsPage from '../domain/events/EventsPage';

const Events: NextPage = () => <EventsPage />;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  // eslint-disable-next-line no-console
  console.debug(
    'Executing getStaticProps of the front page',
    '/pages/index.tsx'
  );
  return {
    ...(await CommonPropsService.getCommonStaticProps(context)),
    revalidate: 60 * 60, // Once in an hour
  };
};

export default Events;

import { NextPage, GetStaticProps, GetStaticPropsContext } from 'next';
import React from 'react';

import { CommonPropsService } from '../domain/app/ssr/serverSidePropsService';
import EventsPage from '../domain/events/EventsPage';

const Events: NextPage = () => <EventsPage />;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  return await CommonPropsService.getCommonStaticProps(context);
};

export default Events;

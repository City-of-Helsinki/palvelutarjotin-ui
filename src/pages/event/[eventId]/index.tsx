import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import React from 'react';

import { CommonPropsService } from '../../../domain/app/ssr/serverSidePropsService';
import EventPage from '../../../domain/event/EventPage';

const Event: NextPage = () => <EventPage />;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  // eslint-disable-next-line no-console
  console.debug(
    'Executing getStaticProps of an event page',
    '/pages/event/[eventId]/index.tsx',
    { params: context.params }
  );
  return {
    ...(await CommonPropsService.getCommonStaticProps(context)),
    revalidate: 60 * 60, // Once in an hour
  };
};

export default Event;

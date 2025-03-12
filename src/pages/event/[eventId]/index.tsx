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
  return await CommonPropsService.getCommonStaticProps(context);
};

export default Event;

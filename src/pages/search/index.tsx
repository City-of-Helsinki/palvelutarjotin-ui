import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import * as React from 'react';

import { CommonPropsService } from '../../domain/app/ssr/serverSidePropsService';
import EventsSearchPage from '../../domain/events/EventsSearchPage';

const SearchPage: NextPage = () => <EventsSearchPage />;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  return {
    ...(await CommonPropsService.getCommonStaticProps(context)),
    revalidate: 60 * 60, // Once in an hour
  };
};

export default SearchPage;

import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import * as React from 'react';

import { CommonPropsService } from '../../domain/app/ssr/serverSidePropsService';
import EventsSearchPage from '../../domain/events/EventsSearchPage';

const SearchPage: NextPage = () => <EventsSearchPage />;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  return await CommonPropsService.getCommonStaticProps(context);
};

export default SearchPage;

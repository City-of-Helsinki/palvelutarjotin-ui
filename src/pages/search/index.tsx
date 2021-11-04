import { NextPage, NextPageContext } from 'next';
import * as React from 'react';

import withApollo from '../../domain/app/apollo/configureApollo';
import EventsSearchPage from '../../domain/events/EventsSearchPage';
import getLocalizationProps from '../../utils/getLocalizationProps';

const SearchPage: NextPage = () => <EventsSearchPage />;

SearchPage.getInitialProps = async ({ locale }: NextPageContext) =>
  getLocalizationProps(locale);

export default withApollo(SearchPage);

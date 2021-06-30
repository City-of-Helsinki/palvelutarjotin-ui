/* eslint-disable @typescript-eslint/no-require-imports */
import { NextPage, NextPageContext } from 'next';
import React from 'react';

import withApollo from '../domain/app/apollo/configureApollo';
import EventsPage from '../domain/events/EventsPage';
import getLocalizationProps from '../utils/getLocalizationProps';

const Events: NextPage = () => <EventsPage />;

Events.getInitialProps = async ({ locale }: NextPageContext) =>
  getLocalizationProps(locale);

export default withApollo(Events);

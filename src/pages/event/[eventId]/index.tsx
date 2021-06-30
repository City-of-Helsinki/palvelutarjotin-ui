import { NextPage, NextPageContext } from 'next';
import React from 'react';

import withApollo from '../../../domain/app/apollo/configureApollo';
import EventPage from '../../../domain/event/EventPage';
import getLocalizationProps from '../../../utils/getLocalizationProps';

const Event: NextPage = () => <EventPage />;

Event.getInitialProps = async ({ locale }: NextPageContext) =>
  getLocalizationProps(locale);

export default withApollo(Event);

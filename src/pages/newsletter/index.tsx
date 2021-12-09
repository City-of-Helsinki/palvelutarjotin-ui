import { NextPage, NextPageContext } from 'next';
import React from 'react';

import SubscribeNewsletterPage from '../../domain/newsletter/SubscribeNewsletterPage';
import getLocalizationProps from '../../utils/getLocalizationProps';

const SubscribeNewsLetter: NextPage = () => <SubscribeNewsletterPage />;

SubscribeNewsLetter.getInitialProps = async ({ locale }: NextPageContext) =>
  getLocalizationProps(locale);

export default SubscribeNewsLetter;

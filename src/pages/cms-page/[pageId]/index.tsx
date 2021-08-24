import { NextPage, NextPageContext } from 'next';
import React from 'react';

import withApollo from '../../../domain/app/apollo/configureApollo';
import CmsPageContent from '../../../headless-cms/components/CmsPageContent';
import getLocalizationProps from '../../../utils/getLocalizationProps';

const CmsPage: NextPage = () => <CmsPageContent />;

CmsPage.getInitialProps = async ({ locale }: NextPageContext) =>
  getLocalizationProps(locale);

export default withApollo(CmsPage);

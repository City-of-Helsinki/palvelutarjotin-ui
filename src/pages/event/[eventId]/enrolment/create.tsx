import { NextPage, NextPageContext } from 'next';
import React from 'react';

import withApollo from '../../../../domain/app/apollo/configureApollo';
import CreateEnrolmentPage from '../../../../domain/enrolment/CreateEnrolmentPage';
import getLocalizationProps from '../../../../utils/getLocalizationProps';

const CreateEnrolment: NextPage = () => <CreateEnrolmentPage />;

CreateEnrolment.getInitialProps = async ({ locale }: NextPageContext) =>
  getLocalizationProps(locale);

export default withApollo(CreateEnrolment);

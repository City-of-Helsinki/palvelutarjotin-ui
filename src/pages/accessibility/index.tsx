import { NextPage, NextPageContext } from 'next';
import React from 'react';

import AccessibilityStatementPage from '../../domain/accessibilityStatement/AccessibilityStatement';
import getLocalizationProps from '../../utils/getLocalizationProps';

const AccessibilityStatement: NextPage = () => <AccessibilityStatementPage />;

AccessibilityStatement.getInitialProps = async ({ locale }: NextPageContext) =>
  getLocalizationProps(locale);

export default AccessibilityStatement;

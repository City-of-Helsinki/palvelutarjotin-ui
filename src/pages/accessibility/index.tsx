import React from 'react';

import { COMMON_I18N_NAMESPACES } from '../../constants';
import AccessibilityStatementPage from '../../domain/accessibilityStatement/AccessibilityStatement';
import { RouteComponent } from '../../types';

const AccessibilityStatement: RouteComponent = () => (
  <AccessibilityStatementPage />
);

AccessibilityStatement.getInitialProps = async () => ({
  namespacesRequired: [...COMMON_I18N_NAMESPACES],
});

export default AccessibilityStatement;

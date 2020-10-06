import React from 'react';

import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import styles from './accessibilityStatement.module.scss';
import AccessibilityStatementEn from './AccessibilityStatementEn';
import AccessibilityStatementFi from './AccessibilityStatementFi';
import AccessibilityStatementSv from './AccessibilityStatementSv';

type StatementProps = {
  lang: string;
};

const Statement: React.FC<StatementProps> = (props) => {
  const lang = props.lang;
  switch (lang) {
    case 'en':
      return <AccessibilityStatementEn />;
    case 'fi':
      return <AccessibilityStatementFi />;
    case 'sv':
      return <AccessibilityStatementSv />;
    default:
      return <p>Invalid language.</p>;
  }
};

const AccessibilityStatement: React.FC = () => {
  const locale = useLocale();

  return (
    <PageWrapper title={'common:accessibilityStatement.title'}>
      <Container>
        <div className={styles.accessibilityStatement}>
          <Statement lang={locale} />
        </div>
      </Container>
    </PageWrapper>
  );
};

export default AccessibilityStatement;

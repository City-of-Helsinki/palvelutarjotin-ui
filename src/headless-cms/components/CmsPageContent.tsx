import React from 'react';

import HtmlToReact from '../../common/components/htmlToReact/HtmlToReact';
import Container from '../../domain/app/layout/Container';
import { PageFieldsFragment } from '../../generated/graphql-cms';
import styles from './cmsPageContent.module.scss';
import CmsSidebarContent from './cmsSidebarContent/CmsSidebarContent';

type Props = {
  page?: PageFieldsFragment;
};

const CmsPageContent: React.FC<Props> = ({ page }) => {
  const title = page?.title || '';
  const content = page?.content || '';
  const sidebar = page?.sidebar || [];

  return (
    <Container>
      {page && (
        <div className={styles.cmsSidebarLayout}>
          <div className={styles.cmsSidebarLayoutMain}>
            <h1>{title}</h1>
            <HtmlToReact>{content}</HtmlToReact>
          </div>
          <aside className={styles.cmsSidebarLayoutAside}>
            <CmsSidebarContent content={sidebar} />
          </aside>
        </div>
      )}
    </Container>
  );
};

export default CmsPageContent;

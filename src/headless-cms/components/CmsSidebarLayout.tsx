import React from 'react';

import HtmlToReact from '../../common/components/htmlToReact/HtmlToReact';
import Container from '../../domain/app/layout/Container';
import { PageFieldsFragment } from '../../generated/graphql-cms';
import styles from './cmsSidebarLayout.module.scss';

type Props = {
  page: PageFieldsFragment | undefined;
};

const CmsSidebarLayout: React.FC<Props> = ({ page }) => {
  const title = page?.title || '';
  const content = page?.content || '';

  return (
    <Container>
      {page && (
        <div className={styles.cmsSidebarLayout}>
          <div className={styles.cmsSidebarLayoutMain}>
            <h1>{title}</h1>
            <HtmlToReact>{content}</HtmlToReact>
          </div>
          <aside
            className={styles.cmsSidebarLayoutAside}
            // TODO: Remove and replace with selector targeting sidebar content
            // when it has been implemented.
            data-testid="cms-sidebar-layout-sidebar"
          >
            {/* TODO: Render sidebar content */}
          </aside>
        </div>
      )}
    </Container>
  );
};

export default CmsSidebarLayout;

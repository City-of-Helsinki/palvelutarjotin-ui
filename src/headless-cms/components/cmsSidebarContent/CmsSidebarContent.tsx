import React from 'react';

import { PageFieldsFragment } from '../../../generated/graphql-cms';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import styles from './cmsSidebarContent.module.scss';
import CmsSidebarContentCard from './CmsSidebarContentCard';
import CmsSidebarContentLayoutLinkList from './CmsSidebarContentLayoutLinkList';

type Props = {
  content?: PageFieldsFragment['sidebar'];
};

const CmsSidebarContent: React.FC<Props> = ({ content }) => {
  const locale = useLocale();

  return (
    <ul className={styles.container}>
      {content?.map((item, i) => {
        if (item?.__typename === 'LayoutLinkList') {
          return (
            <li key={item.title}>
              <CmsSidebarContentLayoutLinkList
                title={item.title}
                links={item.links}
                description={item.description}
                anchor={item.anchor}
              />
            </li>
          );
        }

        if (item?.__typename === 'LayoutPages') {
          return item?.pages?.map((page) => {
            const title = page?.title;
            const uri = page?.uri;

            if (!title || !uri) {
              return null;
            }

            return (
              <li key={page?.id}>
                <CmsSidebarContentCard
                  title={title}
                  url={createCmsLink(uri, locale)}
                  image={page?.featuredImage?.node?.mediaItemUrl || undefined}
                  imageAlt={page?.featuredImage?.node?.altText || undefined}
                />
              </li>
            );
          });
        }

        if (item?.__typename === 'LayoutArticles') {
          return item?.articles?.map((article) => {
            const title = article?.title;
            const uri = article?.uri;

            if (!title || !uri) {
              return null;
            }

            return (
              <li key={article?.id}>
                <CmsSidebarContentCard
                  title={title}
                  url={createCmsLink(uri, locale)}
                  image={
                    article?.featuredImage?.node?.mediaItemUrl || undefined
                  }
                  imageAlt={article?.featuredImage?.node?.altText || undefined}
                />
              </li>
            );
          });
        }

        return null;
      })}
    </ul>
  );
};

export default CmsSidebarContent;

function createCmsLink(cmsUri: string, language: Language) {
  const baseUri = `/cms-page${cmsUri}`;

  if (language === 'fi') {
    return baseUri;
  }

  return `/${language}${baseUri}`;
}

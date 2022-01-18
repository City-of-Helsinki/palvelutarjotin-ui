import React from 'react';

import { PageFieldsFragment } from '../../../generated/graphql-cms';
import CmsSidebarContentLayoutLinkList from './CmsSidebarContentLayoutLinkList';

type Props = {
  content?: PageFieldsFragment['sidebar'];
};

const CmsSidebarContent: React.FC<Props> = ({ content }) => {
  return (
    <>
      {content?.map((item) => {
        if (item?.__typename === 'LayoutLinkList') {
          return (
            <CmsSidebarContentLayoutLinkList
              key={item.title}
              title={item.title}
              links={item.links}
              description={item.description}
              anchor={item.anchor}
            />
          );
        }

        return null;
      })}
    </>
  );
};

export default CmsSidebarContent;

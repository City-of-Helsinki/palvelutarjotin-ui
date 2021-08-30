import React from 'react';

import { render } from '../../../../utils/testUtils';
import PageMeta from '../PageMeta';

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>;
    },
  };
});

// just a simple snapshot test to make sure component is rendering stuff correctly
it('renders meta elements', async () => {
  const { container } = render(
    <PageMeta
      title="Title"
      description="description"
      openGraphDescription="openGraphDescription"
      openGraphTitle="openGraphTitle"
    />
  );

  expect(container).toMatchSnapshot();
});

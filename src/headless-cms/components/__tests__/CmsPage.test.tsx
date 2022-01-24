import { TextEncoder, TextDecoder } from 'util';

import { fakePage } from '../../../utils/cmsMockDataUtils';
import { render, screen } from '../../../utils/testUtils';
import CmsPage from '../CmsPage';

// To avoid error: ReferenceError: TextEncoder is not defined
// discussed here: https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

test('renders with sidebar layout when sidebar has content', async () => {
  render(
    <CmsPage
      breadcrumbs={[]}
      page={fakePage({
        title: 'Alisivun otsikko',
        content: 'Alisivun kontentti',
        sidebar: [{ title: 'Placeholder' }],
      })}
    />
  );

  // TODO: Remove and replace with selector targeting sidebar content when it
  // has been implemented.
  expect(
    screen.queryByTestId('cms-sidebar-layout-sidebar')
  ).toBeInTheDocument();
});

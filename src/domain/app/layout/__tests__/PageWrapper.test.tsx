/* eslint-disable @typescript-eslint/no-explicit-any */
import matomo from '@datapunt/matomo-tracker-react';
import * as nextRouter from 'next/router';
import * as React from 'react';

import { render } from '../../../../utils/testUtils';
import PageWrapper from '../PageWrapper';

afterEach(() => {
  jest.restoreAllMocks();
});

jest.mock('@datapunt/matomo-tracker-react', () => ({
  useMatomo: jest.fn().mockReturnValue({ trackPageView: jest.fn() }),
}));

const setHref = (href: string) => {
  Object.defineProperty(window, 'location', {
    value: {
      ...window.location,
      href,
    },
    writable: true,
  });
};

test('PageWrapper matches snapshot', async () => {
  const { container } = render(
    <PageWrapper>
      <div>Children</div>
    </PageWrapper>
  );

  expect(container).toMatchSnapshot();
});

test('trackPageView gets called when pathname changes', async () => {
  const testHref1 = 'testurl.com';
  const testHref2 = 'testurl2.com';
  const trackPageViewMock = jest.fn();
  setHref(testHref1);

  jest
    .spyOn(matomo, 'useMatomo')
    .mockReturnValue({ trackPageView: trackPageViewMock } as any);

  const { rerender } = render(<PageWrapper />, { path: '/test1' });

  expect(trackPageViewMock).toHaveBeenCalledWith({ href: testHref1 });

  trackPageViewMock.mockReset();

  setHref(testHref2);
  jest
    .spyOn(nextRouter, 'useRouter')
    .mockReturnValue({ asPath: '/test2' } as any);

  // for some reson react log error:
  // Warning: React has detected a change in the order of Hooks called by PageWrapper.
  // but don't know what could be causing this... so lets silence it
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  jest.spyOn(console, 'error').mockImplementation(() => {});

  rerender(<PageWrapper />);

  expect(trackPageViewMock).toHaveBeenCalledWith({ href: testHref2 });
});

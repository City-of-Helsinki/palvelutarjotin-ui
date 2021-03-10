/* eslint-disable @typescript-eslint/no-explicit-any */
import matomo from '@datapunt/matomo-tracker-react';
import * as nextRouter from 'next/router';
import * as React from 'react';

import { render } from '../../../../utils/testUtils';
import PageWrapper from '../PageWrapper';

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

test('trackPageView gets called when pathname changes', () => {
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

  rerender(<PageWrapper />);

  expect(trackPageViewMock).toHaveBeenCalledWith({ href: testHref2 });
});

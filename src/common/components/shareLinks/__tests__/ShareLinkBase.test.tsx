import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import ShareLinkBase, { ShareLinkBaseProps } from '../ShareLinkBase';

const getWrapper = (props: ShareLinkBaseProps) =>
  render(<ShareLinkBase {...props} />);
const testLabel = 'Share Link';
const testWindowName = 'Window name';

const jestOpen = window.open;

beforeAll(() => {
  window.open = jest.fn();
});

afterAll(() => {
  window.open = jestOpen;
});

test('should apply an aria label', () => {
  const { queryByLabelText } = getWrapper({
    linkLabel: testLabel,
    windowName: testWindowName,
  } as ShareLinkBaseProps);

  expect(queryByLabelText(testLabel)).not.toEqual(null);
});

test('should have button attribute', () => {
  const { queryByLabelText } = getWrapper({
    linkLabel: testLabel,
    windowName: testWindowName,
  } as ShareLinkBaseProps);

  expect(queryByLabelText(testLabel)).toHaveAttribute('type', 'button');
});

test('should launch sharing link in a pop up window with encoded uri components', () => {
  const url = 'https://localhost';
  const queryParameters = {
    url: 'https://helsinki.fi/path/',
  };
  const spy = jest.spyOn(window, 'open');
  const { getByLabelText } = getWrapper({
    linkLabel: testLabel,
    queryParameters,
    url,
    windowName: testWindowName,
    icon: null,
  } as ShareLinkBaseProps);
  const link = getByLabelText(testLabel);

  fireEvent.click(link);

  expect(spy).toHaveBeenLastCalledWith(
    `${url}?url=${encodeURIComponent(queryParameters.url)}`,
    testWindowName,
    expect.any(String)
  );
});

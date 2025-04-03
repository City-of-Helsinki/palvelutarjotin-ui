import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';

import useHashlessReturnPathScrollFix from '../useHashlessReturnPathScrollFix';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('useHashlessReturnPathScrollFix', () => {
  const mockedRouter = {
    asPath: '',
    pathname: '/test',
    query: {},
    replace: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockedRouter);
    mockedRouter.replace.mockClear();
    mockedRouter.asPath = '';
  });

  it('should not call router.replace if there is no hash', () => {
    renderHook(() => useHashlessReturnPathScrollFix());
    expect(mockedRouter.replace).not.toHaveBeenCalled();
  });

  it('should call router.replace with correct parameters if there is a hash', async () => {
    mockedRouter.asPath = '/test#hash';
    renderHook(() => useHashlessReturnPathScrollFix());
    expect(mockedRouter.replace).toHaveBeenCalledWith(
      {
        pathname: '/test',
        query: {},
        hash: undefined,
      },
      undefined,
      { shallow: true }
    );
  });

  it('should catch and not rethrow cancelled errors', async () => {
    mockedRouter.asPath = '/test#hash';
    const error = { cancelled: true };
    mockedRouter.replace.mockRejectedValue(error);
    renderHook(() => useHashlessReturnPathScrollFix());
    await expect(mockedRouter.replace()).rejects.toEqual(error);
  });
});

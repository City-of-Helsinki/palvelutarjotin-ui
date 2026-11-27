import axiosClient from '../../gruppoClient';
import { deleteSubscriber, unsubscribe } from '../subscribers';

jest.mock('../../gruppoClient', () => ({
  __esModule: true,
  ...jest.requireActual('../../gruppoClient'),
  default: {
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAxiosClient = jest.mocked(axiosClient);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('unsubscribe', () => {
  it('posts the subscriber data to the group unsubscribe endpoint', async () => {
    mockedAxiosClient.post.mockResolvedValue({ data: '' });

    await unsubscribe('group1', { EmailAddress: 'test@example.com' });

    expect(mockedAxiosClient.post).toHaveBeenCalledWith(
      '/subscribers/group1/unsubscribe.json',
      JSON.stringify({ EmailAddress: 'test@example.com' })
    );
  });

  it('rejects when the request fails', async () => {
    mockedAxiosClient.post.mockRejectedValue(new Error('network error'));

    await expect(
      unsubscribe('group1', { EmailAddress: 'test@example.com' })
    ).rejects.toThrow('network error');
  });
});

describe('deleteSubscriber', () => {
  it('deletes the subscriber by email from the group', async () => {
    const response = { data: 'deleted' };
    mockedAxiosClient.delete.mockResolvedValue(response);

    await expect(deleteSubscriber('group1', 'test@example.com')).resolves.toBe(
      response
    );

    expect(mockedAxiosClient.delete).toHaveBeenCalledWith(
      '/subscribers/group1.json?email=test@example.com'
    );
  });
});

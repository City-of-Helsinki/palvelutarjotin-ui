import type { NextApiResponse } from 'next';

import handler from '../version';

test('version response', async () => {
  const req: any = {};
  const json = jest.fn();
  const status = jest.fn(() => {
    return {
      json,
    };
  });
  const res: any = {
    status,
  };

  handler(
    req,
    // FIXME: Don't bypass type system but use proper types
    res as unknown as NextApiResponse
  );
  const res_json = json.mock.calls[0][0];

  expect(res_json.status).toEqual('ok');
  expect(res_json.release);
  expect(res_json.packageVersion);
  expect(res_json.commitHash);
  expect(res_json.buildTime);
});

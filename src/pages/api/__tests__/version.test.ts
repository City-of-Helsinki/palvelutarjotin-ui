import handler from '../version';

test('version response', async () => {
  const req = {};
  const json = jest.fn();
  const status = jest.fn(() => {
    return {
      json,
    };
  });
  const res = {
    status,
  };

  handler(req, res);
  const res_json = json.mock.calls[0][0];

  // console.log(res_json);

  expect(res_json.status).toEqual('ok');
  expect(res_json.release);
  expect(res_json.packageVersion);
  expect(res_json.commitHash);
  expect(res_json.buildTime);
});

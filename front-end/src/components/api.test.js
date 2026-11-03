jest.mock('axios', () => jest.requireActual('axios/dist/node/axios.cjs'));
const { createApiClient } = require('./api');

const response = config => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config });
test('obtains a fresh Clerk token for each backend request', async () => {
  const getToken = jest.fn().mockResolvedValueOnce('first-session-token').mockResolvedValueOnce('refreshed-token');
  const api = createApiClient(getToken, 'http://localhost:8081');
  const seen = [];
  api.defaults.adapter = config => { seen.push(config.headers.Authorization); return response(config); };
  await api.get('/users/me');
  await api.get('/users/me');
  expect(seen).toEqual(['Bearer first-session-token', 'Bearer refreshed-token']);
});
test('never sends credentials to another origin', async () => {
  const getToken = jest.fn();
  const api = createApiClient(getToken, 'http://localhost:8081');
  const adapter = jest.fn(response);
  api.defaults.adapter = adapter;
  await expect(api.get('https://other.example.com/users/me')).rejects.toThrow('outside the backend');
  await expect(api.get('/users/me', { baseURL: 'https://other.example.com' })).rejects.toThrow('override');
  expect(getToken).not.toHaveBeenCalled();
  expect(adapter).not.toHaveBeenCalled();
});
test('missing sessions and missing configuration fail before network calls', async () => {
  for (const api of [createApiClient(async () => null, 'http://localhost:8081'), createApiClient(async () => 'token', '')]) {
    const adapter = jest.fn(response);
    api.defaults.adapter = adapter;
    await expect(api.get('/users/me')).rejects.toThrow();
    expect(adapter).not.toHaveBeenCalled();
  }
});

import axios from 'axios';

// Use one explicitly configured backend. Never attach Clerk credentials to Sheets
// or other third-party URLs; those requests continue to use plain axios.
export function createApiClient(getToken, baseURL = process.env.REACT_APP_API_BASE_URL) {
  const api = axios.create({ baseURL });
  api.interceptors.request.use(async config => {
    if (!baseURL) throw new Error('REACT_APP_API_BASE_URL is not configured');
    const backend = new URL(baseURL);
    if (config.baseURL !== baseURL) throw new Error('Refusing to override the authenticated backend');
    const target = new URL(config.url, `${backend.href.replace(/\/$/, '')}/`);
    if (target.origin !== backend.origin) throw new Error('Refusing to send a session token outside the backend');
    const token = await getToken();
    if (!token) throw new Error('Please sign in to continue');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return api;
}

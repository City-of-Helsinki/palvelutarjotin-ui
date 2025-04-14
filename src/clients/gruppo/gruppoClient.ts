import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEWSLETTER_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiKey = process.env.NEWSLETTER_APIKEY;

axiosClient.interceptors.request.use(
  (config) => {
    if (apiKey && config?.headers) {
      config.auth = {
        username: apiKey,
        password: 'x',
      };
    }
    return config;
  },
  (error) => {
    if (error instanceof Error) {
      return Promise.reject(error);
    } else {
      return Promise.reject(new Error(JSON.stringify(error)));
    }
  }
);

export enum SUBSCRIBERS_ROUTES {
  DETAILS = '/subscribers/:groupId.json?email=:email&includetrackingpreference=true',
  CREATE = '/subscribers/:groupId.json',
  UNSUBSCRIBE = '/subscribers/:groupId/unsubscribe.json',
  DELETE = '/subscribers/:groupId.json?email=:email',
}

export default axiosClient;

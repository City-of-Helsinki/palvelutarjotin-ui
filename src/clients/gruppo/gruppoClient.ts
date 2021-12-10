import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEWSLETTER_BASE_URL,
  timeout: 30000,
});

const apiKey = process.env.NEXT_PUBLIC_NEWSLETTER_APIKEY;

axiosClient.interceptors.request.use(
  (config) => {
    if (apiKey && config?.headers) {
      config.headers.authorization = `Basic ${apiKey}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export enum SUBSCRIBERS_ROUTES {
  DETAILS = '/subscribers/:groupId.json?email=:email&includetrackingpreference=true',
  CREATE = '/subscribers/:groupId.json',
  UNSUBSCRIBE = '/subscribers/:groupId/unsubscribe.json',
  DELETE = '/subscribers/:groupId.json?email=:email',
}

export default axiosClient;

import type { NextApiRequest, NextApiResponse } from 'next';

import { SUPPORTED_LANGUAGES } from '../../constants';
import { CommonApolloQueriesService } from '../../domain/app/ssr/commonApolloQueriesService';
import { initializeCMSApolloClient } from '../../domain/headless-cms/apollo/apolloClient';

// remove duplicates from array
function uniqBySetWithArrayFrom<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let customUri = '';

  // only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  // Check for secret to confirm this is a valid request
  if (req.body.secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (req.body.uri) {
    customUri = req.body.uri;
  }
  const cmsApolloClient = initializeCMSApolloClient();
  // Fetch menu data to cache for the components so they can be rendered in the server
  const commonApolloQueriesService = new CommonApolloQueriesService({
    cmsApolloClient,
  });

  try {
    if (customUri === '') {
      // get all articles and pages
      const pages = [
        ...(await commonApolloQueriesService.getAllArticles()),
        ...(await commonApolloQueriesService.getAllPages()),
      ].map((pageInfo) => {
        return pageInfo.uri.replace(/\/$/, '');
      });

      // root pages
      for (const lng of Object.values(SUPPORTED_LANGUAGES)) {
        pages.push('/' + lng);
      }

      _revalidateAll(res, pages).catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Error during _revalidateAll`, err);
      });
    } else {
      _revalidate(res, customUri).catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Error during _revalidate ${customUri}`, err);
      });
    }
    return res.status(200).json({ revalidatetrigger: true });
  } catch {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}

// revalidate all pages one by one
async function _revalidateAll(res: NextApiResponse, pages: string[]) {
  for (const page of uniqBySetWithArrayFrom(pages)) {
    await _revalidate(res, page);
  }
}

// revalidate a page
// return the uri if revalidation failed
async function _revalidate(res: NextApiResponse, uri: string) {
  try {
    const _uri = uri.replace(/\/$/, '');
    if (_uri.length < 1) return null;

    // eslint-disable-next-line no-console
    console.info(`Revalidate a page: ${uri}`);
    await res.revalidate(_uri);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error while revalidate a page: ${uri}`, err);
    return uri;
  }
  return null;
}

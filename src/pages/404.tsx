import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import React from 'react';

import NotFoundPage from '../domain/notFoundPage/NotFoundPage';
import getLocalizationProps from '../utils/getLocalizationProps';

const Error404: NextPage = () => <NotFoundPage />;

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<unknown>> {
  // eslint-disable-next-line no-console
  console.debug('Executing getStaticProps of the 404 page', '/pages/404.tsx');
  return {
    props: {
      ...(await getLocalizationProps(locale ?? 'fi')),
    },
  };
}

export default Error404;

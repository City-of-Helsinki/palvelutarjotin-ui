import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import NotFoundPage from '../domain/notFoundPage/NotFoundPage';

const Error404: NextPage = () => <NotFoundPage />;

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<unknown>> {
  // eslint-disable-next-line no-console
  console.debug('Executing getStaticProps of the 404 page', '/pages/404.tsx');
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fi', [
        'common',
        'header',
        'footer',
      ])),
    },
  };
}

export default Error404;

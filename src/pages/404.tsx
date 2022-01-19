import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import NotFoundPage from '../domain/notFoundPage/NotFoundPage';

const Error404: NextPage = () => <NotFoundPage />;

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<unknown>> {
  return {
    props: await serverSideTranslations(locale ?? 'fi', ['common', 'header']),
  };
}

export default Error404;

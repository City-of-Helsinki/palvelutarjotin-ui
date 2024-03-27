/* eslint-disable @typescript-eslint/no-require-imports */
import { GetStaticPropsContext, NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { HeaderWrapper, TabsWrapper } from '../temp/temporaryTestComponents';

// const HeaderWrapper = dynamic(
//   () =>
//     import('../temp/temporaryTestComponents').then((mod) => mod.HeaderWrapper),
//   { ssr: true }
// );

// const TabsWrapper = dynamic(
//   () =>
//     import('../temp/temporaryTestComponents').then((mod) => mod.TabsWrapper),
//   { ssr: true }
// );

const Events: NextPage = () => (
  <>
    <HeaderWrapper />
    <TabsWrapper />
  </>
);

export async function getStaticProps(context: GetStaticPropsContext) {
  console.log('now in getStaticProps');
  return { props: {} };
}

export default Events;

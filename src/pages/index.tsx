/* eslint-disable @typescript-eslint/no-require-imports */
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

const HeaderWrapper = dynamic(
  () =>
    import('../temp/temporaryTestComponents').then((mod) => mod.HeaderWrapper),
  { ssr: false }
);

const TabsWrapper = dynamic(
  () =>
    import('../temp/temporaryTestComponents').then((mod) => mod.TabsWrapper),
  { ssr: false }
);

const Events: NextPage = () => (
  <>
    <HeaderWrapper />
    <TabsWrapper />
  </>
);

export default Events;

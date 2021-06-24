import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import nextI18NextConfig from '../../next-i18next.config.js';
import { COMMON_I18N_NAMESPACES } from '../constants';
import EventsPage from '../domain/events/EventsPage';
import { RouteComponent } from '../types';

const Events: RouteComponent = () => <EventsPage />;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(
        locale as string,
        [...COMMON_I18N_NAMESPACES, 'events', 'event'],
        nextI18NextConfig
      )),
    },
  };
};

export default Events;

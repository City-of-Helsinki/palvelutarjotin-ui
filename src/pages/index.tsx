import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { COMMON_I18N_NAMESPACES, DEFAULT_LANGUAGE } from '../constants';
import EventsPage from '../domain/events/EventsPage';
import { RouteComponent } from '../types';

const Events: RouteComponent = () => <EventsPage />;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LANGUAGE, [
        ...COMMON_I18N_NAMESPACES,
        'events',
        'event',
      ])),
    },
  };
};

export default Events;

import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { COMMON_I18N_NAMESPACES, DEFAULT_LANGUAGE } from '../../../constants';
import EventPage from '../../../domain/event/EventPage';
import { RouteComponent } from '../../../types';

const Event: RouteComponent = () => <EventPage />;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LANGUAGE, [
        ...COMMON_I18N_NAMESPACES,
        'event',
        'events',
        'enrolment',
        'form',
        'occurrence',
      ])),
    },
  };
};

export default Event;

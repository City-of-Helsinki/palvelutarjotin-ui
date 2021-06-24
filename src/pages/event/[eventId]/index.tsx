import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import nextI18nextConfig from '../../../../next-i18next.config';
import { COMMON_I18N_NAMESPACES } from '../../../constants';
import EventPage from '../../../domain/event/EventPage';
import { RouteComponent } from '../../../types';

const Event: RouteComponent = () => <EventPage />;

// Event.getInitialProps = async () => ({
//   namespacesRequired: [
//     ...COMMON_I18N_NAMESPACES,
//     'event',
//     'events',
//     'enrolment',
//     'form',
//     'occurrence',
//   ],
// });

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(
        locale as string,
        [
          ...COMMON_I18N_NAMESPACES,
          'event',
          'events',
          'enrolment',
          'form',
          'occurrence',
        ],
        nextI18nextConfig
      )),
    },
  };
};

export default Event;

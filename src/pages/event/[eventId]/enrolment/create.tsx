import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import {
  COMMON_I18N_NAMESPACES,
  DEFAULT_LANGUAGE,
} from '../../../../constants';
import CreateEnrolmentPage from '../../../../domain/enrolment/CreateEnrolmentPage';
import { RouteComponent } from '../../../../types';

const CreateEnrolment: RouteComponent = () => <CreateEnrolmentPage />;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LANGUAGE, [
        ...COMMON_I18N_NAMESPACES,
        'enrolment',
        'form',
      ])),
    },
  };
};

export default CreateEnrolment;

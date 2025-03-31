import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';

import PageMeta, {
  getLanguageAwarePath,
} from '../../../common/components/meta/PageMeta';
import { SUPPORTED_LANGUAGES } from '../../../constants';
import type { I18nNamespace, Language } from '../../../types';

interface Props {
  title?: string;
  children?: React.ReactNode;
}

const PageWrapper: React.FC<Props> = ({ children, title = 'appName' }) => {
  const { t } = useTranslation<I18nNamespace>();
  const { asPath } = useRouter();

  const translatedTitle =
    title !== 'appName'
      ? `${t(title)} - ${t('common:appName')}`
      : t('common:appName');

  return (
    <div>
      <PageMeta
        title={translatedTitle}
        localePaths={Object.values(SUPPORTED_LANGUAGES).map((lang) => ({
          locale: lang as Language,
          path: getLanguageAwarePath(lang, asPath),
        }))}
      />
      <main>{children}</main>
    </div>
  );
};

export default PageWrapper;

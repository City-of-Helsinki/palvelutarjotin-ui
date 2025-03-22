import { useTranslation } from 'next-i18next';
import * as React from 'react';

import Keyword, { KeywordProps } from './Keyword';

export type EnrolmentStatusKeywordPropsType = {
  enrolmentStatus?: 'free_space_available' | 'full' | 'externally_unknown';
};

const colorByEnrolmentStatus: Record<
  NonNullable<EnrolmentStatusKeywordPropsType['enrolmentStatus']>,
  KeywordProps['color']
> = {
  externally_unknown: 'yellow',
  free_space_available: 'green',
  full: 'red',
};

const EnrolmentStatusKeyword: React.FC<EnrolmentStatusKeywordPropsType> = ({
  enrolmentStatus,
}) => {
  const { t } = useTranslation();
  const color = enrolmentStatus
    ? colorByEnrolmentStatus[enrolmentStatus]
    : undefined;
  return (
    <Keyword
      keyword={t(`event:keywords.enrolmentStatus.${enrolmentStatus}`)}
      aria-label={t('event:keywords.labelKeywordLink', {
        keyword: t(`event:keywords.enrolmentStatus.${enrolmentStatus}`),
      })}
      color={color}
      itemType="static"
      href={null}
    />
  );
};

export default EnrolmentStatusKeyword;

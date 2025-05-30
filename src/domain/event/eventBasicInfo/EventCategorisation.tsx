import { useTranslation } from 'next-i18next';
import * as React from 'react';

import styles from './eventBasicInfo.module.scss';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import type { I18nNamespace } from '../../../types';
import keywordArrayToText from '../../../utils/keywordArrayToText';
import { getEventFields, getRealKeywords } from '../utils';

export const categorisationSectionTestId = 'categorisation-section-testid';

const EventCategorisation: React.FC<{
  event: EventFieldsFragment | null | undefined;
}> = ({ event }) => {
  const locale = useLocale();
  const realKeywords = getRealKeywords({ event });
  const { t } = useTranslation<I18nNamespace>();
  const { categories, activities, audience, languages } = getEventFields(
    event,
    locale
  );

  return (
    <div
      className={styles.eventCategorisation}
      data-testid={categorisationSectionTestId}
    >
      <div className={styles.categorisationRow}>
        <CategorySection
          title={t('event:categorisation.labelCategories')}
          text={keywordArrayToText(categories, locale)}
        />
        <CategorySection
          title={t('event:categorisation.labelActivities')}
          text={keywordArrayToText(activities, locale)}
        />
      </div>
      <div className={styles.categorisationRow}>
        <CategorySection
          title={t('event:categorisation.labelAudience')}
          text={keywordArrayToText(audience, locale)}
        />
        <CategorySection
          title={t('event:categorisation.labelKeywords')}
          text={keywordArrayToText(realKeywords, locale)}
        />
      </div>
      <div className={styles.categorisationRow}>
        <CategorySection
          title={t('event:categorisation.labelLanguages')}
          text={keywordArrayToText(languages, locale)}
        />
      </div>
    </div>
  );
};

const CategorySection: React.FC<{ title: string; text: string }> = ({
  title,
  text,
}) => {
  return (
    <div>
      <div className={styles.categoryTitle}>{title}</div>
      <p>{text}</p>
    </div>
  );
};

export default EventCategorisation;

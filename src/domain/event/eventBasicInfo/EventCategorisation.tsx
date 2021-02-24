import * as React from 'react';

import {
  EventFieldsFragment,
  LocalisedFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { useTranslation } from '../../../i18n';
import getLocalizedString from '../../../utils/getLocalisedString';
import { getEventFields, getRealKeywords } from '../utils';
import styles from './eventBasicInfo.module.scss';

export const categorisationSectionTestId = 'categorisation-section-testid';

const EventCategorisation: React.FC<{
  event: EventFieldsFragment | null | undefined;
}> = ({ event }) => {
  const locale = useLocale();
  const realKeywords = getRealKeywords({ event });
  const { t } = useTranslation();
  const { categories, activities, audience } = getEventFields(event, locale);

  const arrayToText = (
    items: { name?: LocalisedFieldsFragment | null }[] | undefined
  ) => {
    return (
      items
        ?.map((item) => getLocalizedString(item.name || {}, locale))
        .filter(Boolean)
        .sort()
        .join(', ') || '-'
    );
  };

  return (
    <div
      className={styles.eventCategorisation}
      data-testid={categorisationSectionTestId}
    >
      <div className={styles.categorisationRow}>
        <CategorySection
          title={t('event:categorisation.labelCategories')}
          text={arrayToText(categories)}
        />
        <CategorySection
          title={t('event:categorisation.labelActivities')}
          text={arrayToText(activities)}
        />
      </div>
      <div className={styles.categorisationRow}>
        <CategorySection
          title={t('event:categorisation.labelAudience')}
          text={arrayToText(audience)}
        />
        <CategorySection
          title={t('event:categorisation.labelKeywords')}
          text={arrayToText(realKeywords)}
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

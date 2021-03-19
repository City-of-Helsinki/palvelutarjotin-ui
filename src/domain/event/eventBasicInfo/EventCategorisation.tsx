import * as React from 'react';

import {
  EventFieldsFragment,
  LocalisedFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { useTranslation } from '../../../i18n';
import getLocalizedString from '../../../utils/getLocalisedString';
import keywordArrayToText from '../../../utils/keywordArrayToText';
import { getEventFields, getRealKeywords } from '../utils';
import styles from './eventBasicInfo.module.scss';

export const categorisationSectionTestId = 'categorisation-section-testid';

const EventCategorisation: React.FC<{
  event: EventFieldsFragment | null | undefined;
}> = ({ event }) => {
  const locale = useLocale();
  const realKeywords = getRealKeywords({ event });
  const { t } = useTranslation();
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

import { useTranslation } from 'next-i18next';

import { StudyLevelsQuery, useStudyLevelsQuery } from '../../generated/graphql';
import { translateValue } from '../../utils/translateUtils';

interface StudyLevelsState {
  data: StudyLevelsQuery | undefined;
  loading: boolean;
  options: StudyLevelOption[];
}

interface StudyLevelOption {
  label: string;
  value: string;
}

/**
 * Fetch study levels from API and make options of them.
 */
export default function useStudyLevels(): StudyLevelsState {
  const { t } = useTranslation();
  const { data: studyLevelsData, loading } = useStudyLevelsQuery();

  const studyLevelOptions =
    studyLevelsData?.studyLevels?.edges?.map((studyLevelNodeEdge) => {
      const level = studyLevelNodeEdge?.node?.id.toUpperCase();

      if (!level) {
        return { label: '', value: '' };
      }
      if (level.startsWith('GRADE_')) {
        // TECHNICAL DEBT: The ordinal number translations could be done using i18next
        // but that would require at least v21.0.0 of i18next which is a major breaking
        // release.
        const count = Number(level.split('_')[1]);
        if (count > 3) {
          return {
            label:
              count === 10
                ? t('enrolment:studyLevel.grade_10')
                : t('enrolment:studyLevel.grade_with_count', { count: count }),
            value: level,
          };
        }
      }

      return {
        label: translateValue('enrolment:studyLevel.', level, t),
        value: level,
      };
    }) ?? [];

  return {
    data: studyLevelsData,
    loading,
    options: studyLevelOptions,
  };
}

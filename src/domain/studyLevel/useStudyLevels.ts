import { StudyLevelsQuery, useStudyLevelsQuery } from '../../generated/graphql';
import { useTranslation } from '../../i18n';
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
      return {
        label: level.startsWith('GRADE')
          ? t('enrolment:studyLevel.grade_interval', {
              postProcess: 'interval',
              count: Number(level.split('_')[1]),
            })
          : translateValue('enrolment:studyLevel.', level, t),
        value: level,
      };
    }) ?? [];

  return {
    data: studyLevelsData,
    loading,
    options: studyLevelOptions,
  };
}

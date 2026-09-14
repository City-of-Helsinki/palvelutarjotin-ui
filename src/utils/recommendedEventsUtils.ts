import { skipFalsyType } from './typescript.utils';
import { LOCAL_STORAGE } from '../constants';
import { EnrolmentFormFields } from '../domain/enrolment/enrolmentForm/constants';
import { STUDY_LEVEL_TO_KEYWORD_MAP } from '../domain/keyword/constants';

type RecommendedEventsVariables = {
  unitIds?: string[];
  studyLevels?: (keyof typeof STUDY_LEVEL_TO_KEYWORD_MAP)[];
};

export const saveDataForRecommendedEventsQuery = (
  values: EnrolmentFormFields
): void => {
  const {
    studyGroup: { unitId, studyLevels },
  } = values;

  const savedVariables = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE.RECOMMENDED_EVENTS_VARIABLES) as string
  ) as RecommendedEventsVariables | null;
  const previousUnitIds = savedVariables?.unitIds ?? [];
  const previousStudyLevels = savedVariables?.studyLevels ?? [];
  const newUnitIds = [...new Set([...previousUnitIds, unitId])];
  const newStudyLevels = [...new Set([...previousStudyLevels, ...studyLevels])];

  localStorage.setItem(
    LOCAL_STORAGE.RECOMMENDED_EVENTS_VARIABLES,
    JSON.stringify({ unitIds: newUnitIds, studyLevels: newStudyLevels })
  );
};

export const getRecommendedEventsQueryVariables = (): {
  unitIds?: string[];
  studyLevels?: string[];
} => {
  const savedVariables = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE.RECOMMENDED_EVENTS_VARIABLES) as string
  ) as RecommendedEventsVariables | null;

  const mappedStudyLevels = savedVariables?.studyLevels
    ?.map(
      (studyLevel: keyof typeof STUDY_LEVEL_TO_KEYWORD_MAP) =>
        STUDY_LEVEL_TO_KEYWORD_MAP[studyLevel]
    )
    .filter(skipFalsyType);

  const uniqueStudyLevels = mappedStudyLevels
    ? [...new Set(mappedStudyLevels)]
    : [];

  return {
    unitIds: savedVariables?.unitIds ?? [],
    studyLevels: uniqueStudyLevels,
  };
};

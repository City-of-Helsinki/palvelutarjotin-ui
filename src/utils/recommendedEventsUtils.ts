import uniq from 'lodash/uniq';

import { skipFalsyType } from './typescript.utils';
import { LOCAL_STORAGE } from '../constants';
import { EnrolmentFormFields } from '../domain/enrolment/enrolmentForm/constants';
import { STUDY_LEVEL_TO_KEYWORD_MAP } from '../domain/keyword/constants';

export const saveDataForRecommendedEventsQuery = (
  values: EnrolmentFormFields
): void => {
  const {
    studyGroup: { unitId, studyLevels },
  } = values;

  const savedVariables = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE.RECOMMENDED_EVENTS_VARIABLES) as string
  );
  const previousUnitIds = savedVariables?.unitIds ?? [];
  const previousStudyLevels = savedVariables?.studyLevels ?? [];
  const newUnitIds = uniq([...previousUnitIds, unitId]);
  const newStudyLevels = uniq([...previousStudyLevels, ...studyLevels]);

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
  );

  const mappedStudyLevels = savedVariables?.studyLevels
    ?.map(
      (studyLevel: keyof typeof STUDY_LEVEL_TO_KEYWORD_MAP) =>
        STUDY_LEVEL_TO_KEYWORD_MAP[studyLevel]
    )
    .filter(skipFalsyType);

  return {
    unitIds: savedVariables?.unitIds ?? [],
    studyLevels: uniq(mappedStudyLevels),
  };
};

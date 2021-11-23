import { LOCAL_STORAGE } from '../../constants';
import { defaultEnrolmentInitialValues } from '../../domain/enrolment/enrolmentForm/constants';
import {
  getRecommendedEventsQueryVariables,
  saveDataForRecommendedEventsQuery,
} from '../recommendedEventsUtils';

describe('getRecommendedEventsQueryVariables', () => {
  it('returns empty studyLevels when they dont match with hard coded study levels', () => {
    assertGetRecommendedEventsQueryVariables(
      {
        unitIds: ['123', '312'],
        studyLevels: ['level1', 'level2'],
      },
      {
        unitIds: ['123', '312'],
        studyLevels: [],
      }
    );
  });

  it('returns mapped unique studyLevels from local storage', () => {
    assertGetRecommendedEventsQueryVariables(
      {
        unitIds: ['123', '312'],
        studyLevels: ['GRADE_1', 'GRADE_2', 'GRADE_6'],
      },
      {
        unitIds: ['123', '312'],
        studyLevels: ['kultus:55', 'kultus:56'],
      }
    );
  });

  it('returns empty arrays when no variables have been saved before', () => {
    assertGetRecommendedEventsQueryVariables(
      {},
      {
        unitIds: [],
        studyLevels: [],
      }
    );
  });
});

describe('saveDataForRecommendedEventsQuery', () => {
  it('saves recommended event query variables to local storage correctly', () => {
    assertSaveDataForRecommendedEventsQuery(
      {
        unitId: '123',
        studyLevels: ['GRADE_1', 'GRADE_2', 'GRADE_6'],
      },
      {
        unitIds: ['123'],
        studyLevels: ['GRADE_1', 'GRADE_2', 'GRADE_6'],
      }
    );
  });
});

const assertGetRecommendedEventsQueryVariables = (
  value: Record<string, unknown>,
  expected: Record<string, unknown>
) => {
  localStorage.setItem(
    LOCAL_STORAGE.RECOMMENDED_EVENTS_VARIABLES,
    JSON.stringify(value)
  );
  expect(getRecommendedEventsQueryVariables()).toEqual(expected);
};

const assertSaveDataForRecommendedEventsQuery = (
  value: Record<string, unknown>,
  expected: Record<string, unknown>
) => {
  saveDataForRecommendedEventsQuery({
    ...defaultEnrolmentInitialValues,
    studyGroup: {
      ...defaultEnrolmentInitialValues.studyGroup,
      ...value,
    },
  });
  expect(
    JSON.parse(
      localStorage.getItem(LOCAL_STORAGE.RECOMMENDED_EVENTS_VARIABLES) as string
    )
  ).toEqual(expected);
};

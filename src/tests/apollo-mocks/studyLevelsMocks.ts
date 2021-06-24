import { MockedResponse } from '@apollo/client/testing';

import { StudyLevelsDocument } from '../../generated/graphql';
import { fakeStudyLevels } from '../../utils/mockDataUtils';

export const createStudyLevelsQueryMock = (): MockedResponse => ({
  request: {
    query: StudyLevelsDocument,
    variables: {},
  },
  result: {
    data: {
      studyLevels: fakeStudyLevels(),
    },
  },
});

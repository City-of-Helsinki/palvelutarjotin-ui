import gql from 'graphql-tag';

export const QUERY_PERSON = gql`
  fragment studyGroupFields on StudyGroupNode {
    id
    name
    groupSize
    amountOfAdult
    groupName
    studyLevels {
      edges {
        node {
          ...studyLevelFields
        }
      }
    }
    extraNeeds
    person {
      ...personFields
    }
  }
`;

import gql from 'graphql-tag';

export const QUERY_OCCURRENCE = gql`
  fragment languageFields on LanguageNode {
    id
    name
  }

  fragment occurrenceFields on OccurrenceNode {
    id
    pEvent {
      id
    }
    amountOfSeats
    seatsTaken
    seatType
    remainingSeats
    minGroupSize
    maxGroupSize
    languages {
      edges {
        node {
          ...languageFields
        }
      }
    }
    cancelled
    startTime
    endTime
    placeId
    linkedEvent {
      offers {
        ...offerFields
      }
    }
  }

  query Occurrence($id: ID!) {
    occurrence(id: $id) {
      ...occurrenceFields
    }
  }
`;

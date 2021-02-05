import gql from 'graphql-tag';

export const QUERY_OCCURRENCE = gql`
  fragment occurrenceFields on OccurrenceNode {
    id
    pEvent {
      id
      paymentInstruction
    }
    amountOfSeats
    seatsTaken
    minGroupSize
    maxGroupSize
    languages {
      id
      name
    }
    startTime
    endTime
    placeId
    linkedEvent {
      offers {
        isFree
        description {
          fi
          sv
          en
        }
        price {
          fi
          sv
          en
        }
      }
    }
  }

  query Occurrence($id: ID!) {
    occurrence(id: $id) {
      ...occurrenceFields
    }
  }
`;

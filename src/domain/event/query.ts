import { gql } from 'graphql-tag';

export const QUERY_EVENT = gql`
  fragment pEventFields on PalvelutarjotinEventNode {
    autoAcceptance
    id
    enrolmentEndDays
    enrolmentStart
    externalEnrolmentUrl
    neededOccurrences
    contactPhoneNumber
    contactEmail
    isQueueingAllowed
    mandatoryAdditionalInformation
    organisation {
      id
      name
    }
    contactPerson {
      id
      name
    }
    occurrences(upcoming: $upcomingOccurrencesOnly) {
      edges {
        node {
          ...occurrenceFields
        }
      }
    }
    nextOccurrence: occurrences(first: 1, upcoming: true) {
      edges {
        node {
          id
          startTime
          endTime
        }
      }
    }
    organisation {
      ...organisationFields
    }
    nextOccurrenceDatetime
    lastOccurrenceDatetime
  }

  fragment localisedFields on LocalisedObject {
    en
    fi
    sv
  }

  fragment offerFields on Offer {
    isFree
    description {
      ...localisedFields
    }
    price {
      ...localisedFields
    }
    infoUrl {
      ...localisedFields
    }
  }

  fragment eventFields on Event {
    id
    internalId
    name {
      ...localisedFields
    }
    shortDescription {
      ...localisedFields
    }
    description {
      ...localisedFields
    }
    images {
      ...imageFields
    }
    infoUrl {
      ...localisedFields
    }
    offers {
      ...offerFields
    }
    pEvent {
      ...pEventFields
    }
    inLanguage {
      id
      internalId
      name {
        ...localisedFields
      }
    }
    audience {
      ...keywordFields
    }
    keywords {
      ...keywordFields
    }
    location {
      ...placeFields
    }
    venue {
      ...venueFields
    }
    startTime
    additionalCriteria {
      ...keywordFields
    }
    categories {
      ...keywordFields
    }
  }

  query Event($id: ID!, $include: [String], $upcomingOccurrencesOnly: Boolean) {
    event(id: $id, include: $include) {
      ...eventFields
    }
  }
`;

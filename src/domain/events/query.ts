import { gql } from 'graphql-tag';

export const QUERY_EVENTS = gql`
  fragment metaFields on Meta {
    count
    next
    previous
  }

  fragment eventsFields on Event {
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
      id
      nextOccurrenceDatetime
      lastOccurrenceDatetime
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
        id
        name
      }
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
    startTime
  }

  query Events(
    $division: [String]
    $allOngoingAnd: [String]
    $end: String
    $include: [String]
    $inLanguage: String
    $isFree: Boolean
    $keyword: [String]
    $keywordAnd: [String]
    $keywordOrSet1: [String]
    $keywordOrSet2: [String]
    $keywordOrSet3: [String]
    $keywordNot: [String]
    $language: String
    $location: String
    $page: Int
    $pageSize: Int
    $publisher: ID
    $sort: String
    $start: String
    $superEvent: ID
    $superEventType: [String]
    $text: String
    $translation: String
    $organisationId: String
  ) {
    events(
      division: $division
      allOngoingAnd: $allOngoingAnd
      end: $end
      include: $include
      inLanguage: $inLanguage
      isFree: $isFree
      keyword: $keyword
      keywordAnd: $keywordAnd
      keywordOrSet1: $keywordOrSet1
      keywordOrSet2: $keywordOrSet2
      keywordOrSet3: $keywordOrSet3
      keywordNot: $keywordNot
      language: $language
      location: $location
      page: $page
      pageSize: $pageSize
      publisher: $publisher
      sort: $sort
      start: $start
      superEvent: $superEvent
      superEventType: $superEventType
      text: $text
      translation: $translation
      organisationId: $organisationId
    ) {
      meta {
        ...metaFields
      }
      data {
        ...eventsFields
      }
    }
  }
`;

export const UPCOMING_EVENTS_QUERY = gql`
  query UpcomingEvents($page: Int, $pageSize: Int, $include: [String]) {
    upcomingEvents(page: $page, pageSize: $pageSize, include: $include) {
      pageInfo {
        totalCount
        page
        hasNextPage
      }
      data {
        ...eventsFields
      }
    }
  }
`;

import gql from 'graphql-tag';

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
    $end: String
    $include: [String]
    $inLanguage: String
    $isFree: Boolean
    $keyword: [String]
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
      end: $end
      include: $include
      inLanguage: $inLanguage
      isFree: $isFree
      keyword: $keyword
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

import { gql } from '@apollo/client/core';

export const MENU_QUERY = gql`
  query Menu($id: ID!, $idType: MenuNodeIdTypeEnum) {
    menu(id: $id, idType: $idType) {
      menuItems(first: 100) {
        nodes {
          connectedNode {
            node {
              ... on Page {
                ...menuPageFields
                children {
                  nodes {
                    ...menuPageFields
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  fragment menuPageFields on Page {
    ...pageFields
    translations {
      ...pageFields
    }
  }
`;

export const PAGE_QUERY = gql`
  query Page($id: ID!, $idType: PageIdType) {
    page(id: $id, idType: $idType) {
      ...pageFields
      translations {
        ...pageFields
      }
      parent {
        node {
          ... on Page {
            ...pageFields
            translations {
              ...pageFields
            }
          }
        }
      }
      children {
        nodes {
          ... on Page {
            ...pageFields
            translations {
              ...pageFields
            }
          }
        }
      }
    }
  }

  fragment LayoutLinkList on LayoutLinkList {
    anchor
    title
    description
    links {
      target
      title
      url
    }
  }

  fragment LayoutArticles on LayoutArticles {
    title
    articles {
      id
      title
      link
      lead
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
    }
  }

  fragment LayoutPages on LayoutPages {
    title
    pages {
      id
      title
      link
      lead
      featuredImage {
        node {
          altText
          mediaItemUrl
        }
      }
    }
  }

  fragment pageFields on Page {
    id
    content
    slug
    title
    uri
    link
    lead
    seo {
      ...seoFields
    }
    language {
      code
      slug
      locale
      name
    }
    featuredImage {
      node {
        mediaItemUrl
        link
        altText
        mimeType
        title
        uri
      }
    }
    sidebar {
      ... on LayoutLinkList {
        ...LayoutLinkList
      }
      ... on LayoutArticles {
        ...LayoutArticles
      }
      ... on LayoutPages {
        ...LayoutPages
      }
    }
    modules {
      ... on LayoutArticles {
        ...LayoutArticles
      }
      ... on LayoutPages {
        ...LayoutPages
      }
    }
  }

  fragment seoFields on SEO {
    title
    description
    openGraphTitle
    openGraphDescription
    openGraphType
    twitterTitle
    twitterDescription
  }
`;

export const PAGES_QUERY = gql`
  query Pages {
    pages(first: 100) {
      edges {
        node {
          ...pageFields
        }
      }
    }
  }
`;

export const SUBPAGES_SEARCH_QUERY = gql`
  query SubPagesSearch(
    $id: ID!
    $idType: PageIdType
    $search: String!
    $first: Int
    $after: String
  ) {
    page(id: $id, idType: $idType) {
      id
      children(where: { search: $search }, first: $first, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            ... on Page {
              ...pageFields
              translations {
                ...pageFields
              }
            }
          }
        }
      }
    }
  }
`;

export const PAGES_SEARCH_QUERY = gql`
  query PagesSearch($search: String!, $first: Int, $after: String) {
    pages(where: { search: $search }, first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ... on Page {
            ...pageFields
            translations {
              ...pageFields
            }
          }
        }
      }
    }
  }
`;

export const NOTIFICATION_QUERY = gql`
  query Notification($language: String! = "fi") {
    notification(language: $language) {
      content
      title
      level
      startDate
      endDate
      linkText
      linkUrl
    }
  }
`;

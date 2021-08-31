import { gql } from '@apollo/client/core';

export const MENU_QUERY = gql`
  query Menu($id: ID!, $idType: MenuNodeIdTypeEnum) {
    menu(id: $id, idType: $idType) {
      menuItems(first: 100) {
        nodes {
          connectedNode {
            node {
              ... on Page {
                ...pageFields
                children {
                  nodes {
                    ... on Page {
                      ...pageFields
                    }
                  }
                }
                translations {
                  ...pageFields
                  children {
                    nodes {
                      ... on Page {
                        ...pageFields
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
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
            id
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

  fragment pageFields on Page {
    id
    content
    slug
    title
    uri
    language {
      code
      slug
      locale
      name
    }
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
  query SubPagesSearch($id: ID!, $idType: PageIdType, $search: String!) {
    page(id: $id, idType: $idType) {
      id
      children(where: { search: $search }) {
        edges {
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
  query PagesSearch($search: String!) {
    pages(where: { search: $search }) {
      edges {
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

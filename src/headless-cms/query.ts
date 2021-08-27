import { gql } from '@apollo/client/core';

export const MENU_QUERY = gql`
  query Menu($id: ID!, $idType: MenuNodeIdTypeEnum) {
    menu(id: $id, idType: $idType) {
      menuItems {
        nodes {
          connectedNode {
            node {
              ... on Page {
                title
                uri
                link
                id
                guid
                pageId
                slug
                title
                language {
                  code
                }
                translations {
                  title
                  uri
                  link
                  id
                  guid
                  pageId
                  slug
                  language {
                    code
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
    }
  }
  fragment pageFields on Page {
    id
    content
    title
  }
`;

export const PAGES_QUERY = gql`
  query Pages {
    pages {
      edges {
        node {
          ...pageFields
        }
      }
    }
  }
`;

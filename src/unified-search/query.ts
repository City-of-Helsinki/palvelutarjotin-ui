import { gql } from '@apollo/client/core';

export const ADMINISTRATIVE_DIVISION_QUERY = gql`
  query AdministrativeDivisions($helsinkiCommonOnly: Boolean = true) {
    administrativeDivisions(helsinkiCommonOnly: $helsinkiCommonOnly) {
      id
      type
      name {
        fi
        sv
        en
      }
    }
  }
`;

import { gql } from "@apollo/client";
import { PUBLIC_USER_FIELDS } from "../fragments/public-user-fields.fragment";

export const SEARCH_USERS_BY_NAME_OR_EMAIL = gql`
  ${PUBLIC_USER_FIELDS}
  query Search($searchString: String) {
    usersByNameOrEmail(searchString: $searchString) {
      ...PublicUserFields
    }
  }
`;

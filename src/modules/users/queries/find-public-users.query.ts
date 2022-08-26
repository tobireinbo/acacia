import { gql } from "@apollo/client";
import { PUBLIC_USER_FIELDS } from "../fragments/public-user-fields.fragment";

export const FIND_PUBLIC_USERS = gql`
  ${PUBLIC_USER_FIELDS}
  query Users($where: UserWhere, $options: UserOptions) {
    users(where: $where, options: $options) {
      ...PublicUserFields
    }
  }
`;

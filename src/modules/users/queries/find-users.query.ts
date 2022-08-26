import { gql } from "@apollo/client";
import { PUBLIC_USER_FIELDS } from "../fragments/public-user-fields.fragment";

export const FIND_USERS = gql`
  ${PUBLIC_USER_FIELDS}
  query Users($where: UserWhere) {
    users(where: $where) {
      ...PublicUserFields
      hashedPassword
      salt
      isAdmin
    }
  }
`;

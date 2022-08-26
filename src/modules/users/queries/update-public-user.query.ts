import { gql } from "@apollo/client";
import { PUBLIC_USER_FIELDS } from "../fragments/public-user-fields.fragment";

export const UPDATE_PUBLIC_USER = gql`
  ${PUBLIC_USER_FIELDS}
  mutation UpdatePublicUsers($where: UserWhere, $update: UserUpdateInput) {
    updateUsers(where: $where, update: $update) {
      users {
        ...PublicUserFields
      }
    }
  }
`;

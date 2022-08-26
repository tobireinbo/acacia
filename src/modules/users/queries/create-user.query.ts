import { gql } from "@apollo/client";
import { PUBLIC_USER_FIELDS } from "../fragments/public-user-fields.fragment";

export const CREATE_USER = gql`
  ${PUBLIC_USER_FIELDS}
  mutation CreateUser($input: [UserCreateInput!]!) {
    createUsers(input: $input) {
      users {
        ...PublicUserFields
        salt
        hashedPassword
      }
    }
  }
`;

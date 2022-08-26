import { gql } from "@apollo/client";

export const PUBLIC_USER_FIELDS = gql`
  fragment PublicUserFields on User {
    uuid
    createdAt
    updatedAt
    firstname
    lastname
    email
    avatarUrl
    isAdmin
  }
`;

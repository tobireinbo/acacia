import { gql } from "@apollo/client";

export const MESSAGE_FIELDS = gql`
  fragment MessageFields on Message {
    createdAt
    updatedAt
    uuid
    content
    read
  }
`;

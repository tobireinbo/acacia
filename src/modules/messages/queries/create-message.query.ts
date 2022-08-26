import { gql } from "@apollo/client";
import { MESSAGE_FIELDS } from "../fragments/message-fields.fragment";

export const CREATE_MESSAGE = gql`
  ${MESSAGE_FIELDS}
  mutation CreateMessages($input: [MessageCreateInput!]!) {
    createMessages(input: $input) {
      messages {
        ...MessageFields
      }
    }
  }
`;

import { gql } from "@apollo/client";
import { PUBLIC_USER_FIELDS } from "src/modules/users/fragments/public-user-fields.fragment";
import { MESSAGE_FIELDS } from "../fragments/message-fields.fragment";

export const FIND_MESSAGES_DETAILED = gql`
  ${MESSAGE_FIELDS}
  ${PUBLIC_USER_FIELDS}
  query FindMessages($where: MessageWhere, $options: MessageOptions) {
    messages(where: $where, options: $options) {
      ...MessageFields
      sender {
        ...PublicUserFields
      }
      recipient {
        ...PublicUserFields
      }
    }
  }
`;

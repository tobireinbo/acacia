import { gql } from "@apollo/client";
import { MESSAGE_FIELDS } from "../fragments/message-fields.fragment";

export const UPDATE_MESSAGE = gql`
  ${MESSAGE_FIELDS}
  mutation UpdateMessages(
    $connect: MessageConnectInput
    $disconnect: MessageDisconnectInput
    $where: MessageWhere
    $update: MessageUpdateInput
  ) {
    updateMessages(
      connect: $connect
      disconnect: $disconnect
      where: $where
      update: $update
    ) {
      messages {
        ...MessageFields
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const DELETE_TIMESLOT = gql`
  mutation DeleteTimeslots(
    $where: TimeslotWhere
    $delete: TimeslotDeleteInput
  ) {
    deleteTimeslots(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;

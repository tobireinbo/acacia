import { gql } from "@apollo/client";

export const DELETE_LOCATION = gql`
  mutation DeleteLocations(
    $where: LocationWhere
    $delete: LocationDeleteInput
  ) {
    deleteLocations(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;

import { gql } from "@apollo/client";

export const DELETE_TUTORIAL = gql`
  mutation DeleteTutorials(
    $where: TutorialWhere
    $delete: TutorialDeleteInput
  ) {
    deleteTutorials(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;

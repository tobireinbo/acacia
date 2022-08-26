import { gql } from "@apollo/client";

export const DELETE_CHAPTER = gql`
  mutation DeleteChapters($where: ChapterWhere, $delete: ChapterDeleteInput) {
    deleteChapters(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;

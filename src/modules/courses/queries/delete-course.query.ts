import { gql } from "@apollo/client";

export const DELETE_COURSE = gql`
  mutation DeleteCourses($where: CourseWhere, $delete: CourseDeleteInput) {
    deleteCourses(where: $where, delete: $delete) {
      nodesDeleted
      relationshipsDeleted
    }
  }
`;

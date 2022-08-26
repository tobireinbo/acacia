import { gql } from "@apollo/client";
import { COURSE_FIELDS } from "../fragments/course-fields.fragment";

export const FIND_COURSES = gql`
  ${COURSE_FIELDS}
  query Courses($where: CourseWhere) {
    courses(where: $where) {
      ...CourseFields
    }
  }
`;

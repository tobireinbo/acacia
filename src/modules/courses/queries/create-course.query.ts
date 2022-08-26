import { gql } from "@apollo/client";
import { COURSE_FIELDS } from "../fragments/course-fields.fragment";

export const CREATE_COURSE = gql`
  ${COURSE_FIELDS}
  mutation CreateCourses($input: [CourseCreateInput!]!) {
    createCourses(input: $input) {
      courses {
        ...CourseFields
      }
    }
  }
`;

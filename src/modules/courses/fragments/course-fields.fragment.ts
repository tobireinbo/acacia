import { gql } from "@apollo/client";

export const COURSE_FIELDS = gql`
  fragment CourseFields on Course {
    createdAt
    updatedAt
    uuid
    title
    description
  }
`;

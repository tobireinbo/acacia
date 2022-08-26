import { gql } from "@apollo/client";
import { CHAPTER_FIELDS } from "src/modules/chapters/fragments/chapter-fields.fragment";
import { TUTORIAL_FIELDS } from "src/modules/tutorials/fragments/tutorial-fields.fragment";
import { PUBLIC_USER_FIELDS } from "src/modules/users/fragments/public-user-fields.fragment";
import { COURSE_FIELDS } from "../fragments/course-fields.fragment";

export const FIND_COURSES_DETAILED_NESTED = gql`
  ${COURSE_FIELDS}
  ${PUBLIC_USER_FIELDS}
  ${TUTORIAL_FIELDS}
  ${CHAPTER_FIELDS}
  query Courses($where: CourseWhere) {
    courses(where: $where) {
      ...CourseFields
      participants {
        ...PublicUserFields
      }
      tutorials {
        ...TutorialFields
        chapters {
          ...ChapterFields
        }
      }
      lecturer {
        ...PublicUserFields
      }
    }
  }
`;

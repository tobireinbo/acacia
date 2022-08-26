import { gql } from "@apollo/client";
import { COURSE_FIELDS } from "src/modules/courses/fragments/course-fields.fragment";
import { TUTORIAL_FIELDS } from "src/modules/tutorials/fragments/tutorial-fields.fragment";
import { CHAPTER_FIELDS } from "../fragments/chapter-fields.fragment";

export const FIND_CHAPTERS_DETAILED = gql`
  ${CHAPTER_FIELDS}
  ${TUTORIAL_FIELDS}
  ${COURSE_FIELDS}
  query Chapters($where: ChapterWhere) {
    chapters(where: $where) {
      ...ChapterFields
      tutorial {
        ...TutorialFields
        course {
          ...CourseFields
        }
      }
    }
  }
`;

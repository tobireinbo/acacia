import { gql } from "@apollo/client";
import { CHAPTER_FIELDS } from "src/modules/chapters/fragments/chapter-fields.fragment";
import { COURSE_FIELDS } from "src/modules/courses/fragments/course-fields.fragment";
import { TUTORIAL_FIELDS } from "../fragments/tutorial-fields.fragment";

export const FIND_TUTORIALS_DETAILED = gql`
  ${TUTORIAL_FIELDS}
  ${COURSE_FIELDS}
  ${CHAPTER_FIELDS}
  query Tutorials(
    $where: TutorialWhere
    $options: TutorialOptions
    $chaptersOptions: ChapterOptions
  ) {
    tutorials(where: $where, options: $options) {
      ...TutorialFields
      course {
        ...CourseFields
      }
      chapters(options: $chaptersOptions) {
        ...ChapterFields
      }
    }
  }
`;

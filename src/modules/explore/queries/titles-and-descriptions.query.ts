import { gql } from "@apollo/client";
import { CHAPTER_FIELDS } from "src/modules/chapters/fragments/chapter-fields.fragment";
import { COURSE_FIELDS } from "src/modules/courses/fragments/course-fields.fragment";
import { TUTORIAL_FIELDS } from "src/modules/tutorials/fragments/tutorial-fields.fragment";

export const SEARCH_TITLES_AND_DESCRIPTIONS = gql`
  ${COURSE_FIELDS}
  ${TUTORIAL_FIELDS}
  ${CHAPTER_FIELDS}
  query Search($searchString: String) {
    titlesAndDescriptions(searchString: $searchString) {
      ...CourseFields
      ...TutorialFields
      ...ChapterFields
    }
  }
`;

import { gql } from "@apollo/client";
import { CHAPTER_FIELDS } from "src/modules/chapters/fragments/chapter-fields.fragment";
import { COURSE_FIELDS } from "src/modules/courses/fragments/course-fields.fragment";
import { TUTORIAL_FIELDS } from "../fragments/tutorial-fields.fragment";

export const UPDATE_TUTORIAL = gql`
  ${TUTORIAL_FIELDS}
  ${COURSE_FIELDS}
  ${CHAPTER_FIELDS}
  mutation UpdateTutorials(
    $connect: TutorialConnectInput
    $disconnect: TutorialDisconnectInput
    $where: TutorialWhere
    $update: TutorialUpdateInput
  ) {
    updateTutorials(
      connect: $connect
      disconnect: $disconnect
      where: $where
      update: $update
    ) {
      tutorials {
        ...TutorialFields
        course {
          ...CourseFields
        }
        chapters {
          ...ChapterFields
        }
      }
    }
  }
`;

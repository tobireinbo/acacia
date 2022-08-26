import { gql } from "@apollo/client";
import { TUTORIAL_FIELDS } from "src/modules/tutorials/fragments/tutorial-fields.fragment";
import { CHAPTER_FIELDS } from "../fragments/chapter-fields.fragment";

export const CREATE_CHAPTER = gql`
  ${CHAPTER_FIELDS}
  ${TUTORIAL_FIELDS}
  mutation CreateChapter($input: [ChapterCreateInput!]!) {
    createChapters(input: $input) {
      chapters {
        ...ChapterFields
        tutorial {
          ...TutorialFields
        }
      }
    }
  }
`;

import { gql } from "@apollo/client";
import { TUTORIAL_FIELDS } from "src/modules/tutorials/fragments/tutorial-fields.fragment";
import { CHAPTER_FIELDS } from "../fragments/chapter-fields.fragment";

export const UPDATE_CHAPTER = gql`
  ${CHAPTER_FIELDS}
  ${TUTORIAL_FIELDS}
  mutation UpdateChapters(
    $connect: ChapterConnectInput
    $disconnect: ChapterDisconnectInput
    $where: ChapterWhere
    $update: ChapterUpdateInput
  ) {
    updateChapters(
      connect: $connect
      disconnect: $disconnect
      where: $where
      update: $update
    ) {
      chapters {
        ...ChapterFields
        tutorial {
          ...TutorialFields
        }
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const CHAPTER_FIELDS = gql`
  fragment ChapterFields on Chapter {
    uuid
    createdAt
    updatedAt
    title
    position
    markdown
  }
`;

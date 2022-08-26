import { gql } from "@apollo/client";

export const TUTORIAL_FIELDS = gql`
  fragment TutorialFields on Tutorial {
    uuid
    createdAt
    updatedAt
    title
    description
  }
`;

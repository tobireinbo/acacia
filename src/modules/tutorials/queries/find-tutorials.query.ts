import { gql } from "@apollo/client";
import { TUTORIAL_FIELDS } from "../fragments/tutorial-fields.fragment";

export const FIND_TUTORIALS = gql`
  ${TUTORIAL_FIELDS}
  query Tutorials($where: TutorialWhere, $options: TutorialOptions) {
    tutorials(where: $where, options: $options) {
      ...TutorialFields
    }
  }
`;

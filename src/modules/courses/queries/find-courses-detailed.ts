import { gql } from "@apollo/client";
import { TIMESLOT_FIELDS } from "src/modules/timeslots/fragments/timeslot-fields.fragment";
import { TUTORIAL_FIELDS } from "src/modules/tutorials/fragments/tutorial-fields.fragment";
import { PUBLIC_USER_FIELDS } from "src/modules/users/fragments/public-user-fields.fragment";
import { COURSE_FIELDS } from "../fragments/course-fields.fragment";

export const FIND_COURSES_DETAILED = gql`
  ${COURSE_FIELDS}
  ${PUBLIC_USER_FIELDS}
  ${TUTORIAL_FIELDS}
  ${TIMESLOT_FIELDS}
  query Courses($where: CourseWhere) {
    courses(where: $where) {
      ...CourseFields
      participants {
        ...PublicUserFields
      }
      tutorials {
        ...TutorialFields
      }
      lecturer {
        ...PublicUserFields
      }
      timeslots {
        ...TimeslotFields
      }
    }
  }
`;

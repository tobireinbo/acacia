import { gql } from "@apollo/client";
import { COURSE_FIELDS } from "src/modules/courses/fragments/course-fields.fragment";
import { LOCATION_FIELDS } from "src/modules/locations/fragments/location-fields.fragment";
import { TIMESLOT_FIELDS } from "../fragments/timeslot-fields.fragment";

export const CREATE_TIMESLOT = gql`
  ${TIMESLOT_FIELDS}
  ${COURSE_FIELDS}
  ${LOCATION_FIELDS}
  mutation CreateTimeslots($input: [TimeslotCreateInput!]!) {
    createTimeslots(input: $input) {
      timeslots {
        ...TimeslotFields
        course {
          ...CourseFields
        }
        location {
          ...LocationFields
        }
      }
    }
  }
`;

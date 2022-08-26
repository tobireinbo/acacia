import { gql } from "@apollo/client";
import { COURSE_FIELDS } from "src/modules/courses/fragments/course-fields.fragment";
import { LOCATION_FIELDS } from "src/modules/locations/fragments/location-fields.fragment";
import { TIMESLOT_FIELDS } from "../fragments/timeslot-fields.fragment";

export const FIND_TIMESLOTS_DETAILED = gql`
  ${TIMESLOT_FIELDS}
  ${LOCATION_FIELDS}
  ${COURSE_FIELDS}
  query FindTimeslots($where: TimeslotWhere) {
    timeslots(where: $where) {
      ...TimeslotFields
      location {
        ...LocationFields
      }
      course {
        ...CourseFields
      }
    }
  }
`;

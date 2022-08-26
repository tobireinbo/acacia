import { gql } from "@apollo/client";
import { COURSE_FIELDS } from "src/modules/courses/fragments/course-fields.fragment";
import { LOCATION_FIELDS } from "src/modules/locations/fragments/location-fields.fragment";
import { TIMESLOT_FIELDS } from "../fragments/timeslot-fields.fragment";

export const UPDATE_TIMESLOT = gql`
  ${TIMESLOT_FIELDS}
  ${COURSE_FIELDS}
  ${LOCATION_FIELDS}
  mutation UpdateTimeslots(
    $connect: TimeslotConnectInput
    $disconnect: TimeslotDisconnectInput
    $where: TimeslotWhere
    $update: TimeslotUpdateInput
  ) {
    updateTimeslots(
      connect: $connect
      disconnect: $disconnect
      where: $where
      update: $update
    ) {
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

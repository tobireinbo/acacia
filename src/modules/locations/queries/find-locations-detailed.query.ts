import { gql } from "@apollo/client";
import { TIMESLOT_FIELDS } from "src/modules/timeslots/fragments/timeslot-fields.fragment";
import { LOCATION_FIELDS } from "../fragments/location-fields.fragment";

export const FIND_LOCATIONS_DETAILED = gql`
  ${LOCATION_FIELDS}
  ${TIMESLOT_FIELDS}
  query Locations($where: LocationWhere, $options: LocationOptions) {
    locations(where: $where, options: $options) {
      ...LocationFields
      timeslots {
        ...TimeslotFields
      }
    }
  }
`;

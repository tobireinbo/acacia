import { gql } from "@apollo/client";
import { TIMESLOT_FIELDS } from "src/modules/timeslots/fragments/timeslot-fields.fragment";
import { LOCATION_FIELDS } from "../fragments/location-fields.fragment";

export const UPDATE_LOCATION = gql`
  ${LOCATION_FIELDS}
  ${TIMESLOT_FIELDS}
  mutation UpdateLocations(
    $connect: LocationConnectInput
    $disconnect: LocationDisconnectInput
    $where: LocationWhere
    $update: LocationUpdateInput
  ) {
    updateLocations(
      connect: $connect
      disconnect: $disconnect
      where: $where
      update: $update
    ) {
      locations {
        ...LocationFields
        timeslots {
          ...TimeslotFields
        }
      }
    }
  }
`;

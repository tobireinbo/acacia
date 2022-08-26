import { gql } from "@apollo/client";
import { LOCATION_FIELDS } from "../fragments/location-fields.fragment";

export const FIND_LOCATIONS = gql`
  ${LOCATION_FIELDS}
  query Locations($where: LocationWhere, $options: LocationOptions) {
    locations(where: $where, options: $options) {
      ...LocationFields
    }
  }
`;

import { gql } from "@apollo/client";
import { LOCATION_FIELDS } from "../fragments/location-fields.fragment";

export const CREATE_LOCATION = gql`
  ${LOCATION_FIELDS}
  mutation CreateLocations($input: [LocationCreateInput!]!) {
    createLocations(input: $input) {
      locations {
        ...LocationFields
      }
    }
  }
`;

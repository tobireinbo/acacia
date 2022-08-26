import { gql } from "@apollo/client";

export const TIMESLOT_FIELDS = gql`
  fragment TimeslotFields on Timeslot {
    createdAt
    updatedAt
    uuid
    startDate
    endDate
    reoccuring
  }
`;

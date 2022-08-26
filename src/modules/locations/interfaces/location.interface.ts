import { CommonEntityProps } from "src/shared/interfaces/common-entity-props.interface";
import { Timeslot } from "src/modules/timeslots/interfaces/timeslot.interface";

export interface Location extends CommonEntityProps {
  title: string;
}

export interface PopulatedLocation extends Location {
  timeslots: Array<Timeslot>;
}

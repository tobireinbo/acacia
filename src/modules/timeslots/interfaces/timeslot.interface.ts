import { CommonEntityProps } from "src/shared/interfaces/common-entity-props.interface";
import { Location } from "src/modules/locations/interfaces/location.interface";
import { Course } from "src/modules/courses/interfaces/course.interface";

export interface Timeslot extends CommonEntityProps {
  startDate: string; //iso date
  endDate: string; //iso date
  reoccuring: boolean;
}

export interface PopulatedTimeslot extends Timeslot {
  location?: Location;
  course?: Course;
}

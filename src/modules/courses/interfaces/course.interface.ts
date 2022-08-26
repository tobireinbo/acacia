import { CommonEntityProps } from "src/shared/interfaces/common-entity-props.interface";
import { Tutorial } from "src/modules/tutorials/interfaces/tutorial.interface";
import { PublicUser } from "src/modules/users/interfaces/user.interface";
import { Timeslot } from "src/modules/timeslots/interfaces/timeslot.interface";

export interface Course extends CommonEntityProps {
  title: string;
  description: string;
}

export interface PopulatedCourse extends Course {
  participants: Array<PublicUser>;
  tutorials: Array<Tutorial>;
  lecturer?: PublicUser;
  timeslots: Array<Timeslot>;
}

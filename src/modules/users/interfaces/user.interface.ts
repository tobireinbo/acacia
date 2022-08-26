import { CommonEntityProps } from "src/shared/interfaces/common-entity-props.interface";
import { Course } from "src/modules/courses/interfaces/course.interface";

export interface User extends CommonEntityProps {
  firstname: string;
  lastname: string;
  hashedPassword: string;
  salt: string;
  email: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

export type PublicUser = Omit<User, "hashedPassword" | "salt">;

export interface PopulatedUser extends User {
  courses: Array<Course>;
}

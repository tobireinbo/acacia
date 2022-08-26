import { CommonEntityProps } from "src/shared/interfaces/common-entity-props.interface";
import { Tutorial } from "src/modules/tutorials/interfaces/tutorial.interface";
import { Course } from "src/modules/courses/interfaces/course.interface";

export interface Chapter extends CommonEntityProps {
  title: string;
  position: number;
  markdown?: string;
}

export interface PopulatedChapter extends Chapter {
  tutorial?: Tutorial & { course: Course };
}

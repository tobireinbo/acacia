import { CommonEntityProps } from "src/shared/interfaces/common-entity-props.interface";
import { PopulatedChapter } from "src/modules/chapters/interfaces/chapter.interface";
import { Course } from "src/modules/courses/interfaces/course.interface";

export interface Tutorial extends CommonEntityProps {
  title: string;
  description: string;
}

export interface PopulatedTutorial extends Tutorial {
  chapters: Array<PopulatedChapter>;
  course?: Course;
}

import { PublicUser } from "src/modules/users/interfaces/user.interface";
import { CommonEntityProps } from "src/shared/interfaces/common-entity-props.interface";

export interface Message extends CommonEntityProps {
  content: string;
  read: boolean;
}

export interface PopulatedMessage extends Message {
  sender?: PublicUser;
  recipient?: PublicUser;
}

import { PublicUser } from "src/modules/users/interfaces/user.interface";
import { useAuth } from "src/modules/auth/auth.context";
import { useState, useMemo } from "react";
import Image from "next/image";
import Avatar from "./Avatar";

const ParticipantsList: React.FC<{ participants: Array<PublicUser> }> = ({
  participants,
}) => {
  return (
    <div className="flex flex-wrap gap-1">
      {participants.length < 1 && <p>No Participants</p>}
      {participants?.map((part) => (
        <Participant participant={part} key={part.uuid} />
      ))}
    </div>
  );
};

export default ParticipantsList;

const Participant: React.FC<{ participant: PublicUser }> = ({
  participant,
}) => {
  const { user } = useAuth();
  const [hover, setHover] = useState(false);
  const isCurrentUser = useMemo(() => participant.uuid === user?.uuid, [user]);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={"relative"}
    >
      <Avatar user={participant} />
      {hover && (
        <div
          className={`z-10 absolute -top-2 -left-2 bg-white dark:bg-stone-800 p-2 outline outline-1 ${
            isCurrentUser
              ? "outline-primary"
              : "outline-stone-200 dark:outline-stone-700"
          } shadow-lg rounded-md flex space-x-2 items-start`}
        >
          <Avatar user={participant} />

          <div>
            <h4 className="whitespace-nowrap">
              {participant.firstname + " " + participant.lastname}
              {isCurrentUser && " (You)"}
            </h4>
            <h6>{participant.email}</h6>
          </div>
        </div>
      )}
    </div>
  );
};

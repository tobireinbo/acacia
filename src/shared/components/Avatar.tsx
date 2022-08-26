import { PublicUser } from "src/modules/users/interfaces/user.interface";
import Image from "next/image";

type AvatarProps = {
  user: PublicUser;
};

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  return (
    <div className="w-10 h-10 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden flex items-center justify-center">
      {user.avatarUrl && (
        <div className="w-10 h-10 absolute rounded-full overflow-hidden">
          <Image
            width={"100%"}
            height={"100%"}
            objectFit="cover"
            src={user.avatarUrl}
          />
        </div>
      )}
      <h6>
        {user.firstname[0]}
        {user.lastname[0]}
      </h6>
    </div>
  );
};

export default Avatar;

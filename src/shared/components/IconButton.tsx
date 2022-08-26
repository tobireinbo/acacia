import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useNoChildren from "src/shared/hooks/useNoChildren";
import Button, { ButtonProps } from "./Button";

export type IconButtonProps = ButtonProps & {
  icon: IconProp;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  children,
  className,
  ...props
}) => {
  const noChildren = useNoChildren(children);
  return (
    <Button
      {...props}
      className={`flex items-center justify-center ${className}`}
    >
      <FontAwesomeIcon icon={icon} className={`${!noChildren ? "mr-2" : ""}`} />{" "}
      {children}
    </Button>
  );
};

export default IconButton;

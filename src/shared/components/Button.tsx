import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
  useMemo,
} from "react";
import LoadingSpinner from "./LoadingSpinner";

type Variant = "primary" | "plain" | "secondary" | "primary-light";

export type ButtonProps = {
  variant?: Variant;
  loading?: boolean;
} & PropsWithChildren &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  loading = false,
  ...props
}) => {
  const variantClasses = useMemo(() => {
    switch (variant) {
      case "primary":
        return "hover:bg-primary-light bg-primary";
      case "plain":
        return "hover:bg-stone-200 dark:text-white bg-transparent dark:hover:bg-stone-800";
      case "secondary":
        return "hover:bg-secondary-light bg-secondary";
      case "primary-light":
        return "bg-primary-light hover:bg-white dark:hover:bg-stone-900 dark:hover:text-white hover:outline-primary-light hover:outline outline-1";
    }
  }, [variant]);

  return (
    <button
      {...props}
      className={`rounded text-base font-normal px-3 py-2 text-primary-text ${variantClasses} ${className}`}
    >
      {loading ? <LoadingSpinner variant="dots" /> : children}
    </button>
  );
};

export default Button;

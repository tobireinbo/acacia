import {
  DetailedHTMLProps,
  PropsWithChildren,
  SelectHTMLAttributes,
} from "react";

const Select: React.FC<
  PropsWithChildren &
    DetailedHTMLProps<
      SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    > & { label?: string }
> = ({ label, children, className, ...props }) => {
  return (
    <label className="flex flex-col text-base">
      {label}
      <select
        {...props}
        className={`p-2 bg-stone-100 dark:bg-stone-800 rounded focus:bg-white focus:outline focus:outline-2 focus:outline-primary ${
          className || ""
        }`}
      >
        {children}
      </select>
    </label>
  );
};

export default Select;

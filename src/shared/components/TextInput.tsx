import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  PropsWithChildren,
} from "react";

type TextInputProps = {
  label?: string;
};

const TextInput: React.FC<
  PropsWithChildren &
    TextInputProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ children, label, className, ...props }) => {
  return (
    <label className="flex flex-col text-base ">
      {label}
      <input
        className="bg-stone-100 dark:bg-stone-800 focus:outline-2 focus:outline-primary focus:bg-white dark:focus:bg-stone-600 p-2 text-base mt-1 rounded"
        {...props}
      />
    </label>
  );
};

export default TextInput;

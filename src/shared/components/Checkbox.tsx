import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export type CheckboxProps = { label?: string } & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "type"
>;

const Checkbox: React.FC<CheckboxProps> = ({ label, className, ...props }) => {
  return (
    <label className="flex space-x-2 items-center">
      <input
        type={"checkbox"}
        className={`accent-primary w-4 h-4 ${className}`}
        {...props}
      />
      {label && <h4>{label}</h4>}
    </label>
  );
};

export default Checkbox;

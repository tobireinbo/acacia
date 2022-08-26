import {
  DetailedHTMLProps,
  TextareaHTMLAttributes,
  useMemo,
  forwardRef,
  ForwardRefExoticComponent,
} from "react";

type Props = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  label?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, className, ...props }, ref) => {
    const textarea = (
      <textarea
        ref={ref}
        className={`bg-stone-100 dark:bg-stone-800 dark:focus:bg-stone-900 focus:bg-white focus:outline-2 focus:outline-primary border-stone-200 rounded p-2 resize-none ${
          className || ""
        }`}
        {...props}
      ></textarea>
    );

    if (label)
      return (
        <label className="flex flex-col text-base">
          {label}
          {textarea}
        </label>
      );
    else return textarea;
  }
);

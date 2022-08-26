import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSystem } from "src/modules/system/system.context";
import React, { PropsWithChildren, ReactElement, useState } from "react";

const Accordion: React.FC<
  PropsWithChildren & {
    lazy?: boolean;
    fullscreenable?: boolean;
    defaultIndex?: number;
    entries: Array<{ title: string; element: ReactElement }>;
  }
> = ({
  defaultIndex = -1,
  children,
  entries,
  lazy = true,
  fullscreenable = false,
}) => {
  const [openIndex, setOpenIndex] = useState(defaultIndex);
  return (
    <div className="">
      {entries.map((entry, index) => (
        <AccordionChild
          lazy={lazy}
          key={index}
          fullscreenable={fullscreenable}
          title={entry.title}
          open={index === openIndex}
          onClick={() => {
            if (index === openIndex) {
              setOpenIndex(-1);
            } else {
              setOpenIndex(index);
            }
          }}
        >
          {entry.element}
        </AccordionChild>
      ))}
    </div>
  );
};

export default Accordion;

const AccordionChild: React.FC<
  {
    open: boolean;
    title: string;
    onClick: () => void;
    lazy: boolean;
    fullscreenable: boolean;
  } & PropsWithChildren
> = ({ open, title, children, onClick, lazy, fullscreenable }) => {
  const { injectModal } = useSystem();
  const handleFullscreen = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    injectModal({
      element: (
        <div className="bg-white dark:bg-stone-900 rounded p-4">{children}</div>
      ),
    });
  };

  return (
    <div
      className={`${
        open
          ? "bg-white dark:bg-stone-900 my-2"
          : "bg-stone-100 dark:bg-stone-800"
      } ease-in-out duration-300 first:rounded-t-lg last:rounded-b-lg overflow-hidden border border-stone-200 dark:border-stone-700`}
    >
      <div
        onClick={onClick}
        className={`cursor-pointer p-4 flex justify-between items-center ${
          open ? "border-b border-stone-200 dark:border-stone-700" : ""
        }`}
      >
        <h4 className="font-bold">{title}</h4>
        <div className="flex space-x-4 text-black dark:text-white">
          {open && fullscreenable && (
            <FontAwesomeIcon
              icon={["fas", "expand"]}
              onClick={handleFullscreen}
            />
          )}
          <FontAwesomeIcon
            icon={["fas", "angle-down"]}
            className="ease-in-out duration-300"
            flip={open ? "vertical" : undefined}
          />
        </div>
      </div>
      {lazy ? (
        open && <div className="p-4">{children}</div>
      ) : (
        <div
          className={`p-4 border-b border-stone-300 dark:border-stone-700 ${
            open ? "block" : "hidden"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

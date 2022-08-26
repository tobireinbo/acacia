import React, { ReactElement, useState } from "react";

type TabsProps = {
  tabs: Array<{
    element: ReactElement;
    title: ReactElement;
  }>;
  defaultIndex?: number;
  className?: string;
};

const Tabs: React.FC<TabsProps> = ({ tabs, defaultIndex = 0, className }) => {
  const [openIndex, setOpenIndex] = useState(defaultIndex);

  return (
    <>
      <div className="flex space-x-2 p-2 border-b border-stone-200 dark:border-stone-700">
        {tabs.map((tab, index) => {
          const active = index === openIndex;
          return (
            <div
              onClick={() => setOpenIndex(index)}
              key={index}
              className={`rounded p-2 cursor-pointer ${
                active
                  ? "bg-primary dark:text-black"
                  : "bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              {tab.title}
            </div>
          );
        })}
      </div>
      <div className={className}>{tabs[openIndex].element}</div>
    </>
  );
};

export default Tabs;

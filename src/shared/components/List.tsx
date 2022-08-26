import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useNoChildren from "src/shared/hooks/useNoChildren";
import { PropsWithChildren, useMemo, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Button from "./Button";

export type ListView = "list" | "grid";

type ListProps = {
  title?: string;
  noEntriesLabel?: string;
  hideViewSelector?: boolean;
  initialView?: ListView;
  loadMore?: { action: () => void; end: boolean };
  hideLine?: boolean;
};

export const LIST_VIEWS: Array<{ value: ListView; icon: IconProp }> = [
  { value: "list", icon: ["fas", "list"] },
  { value: "grid", icon: ["fas", "border-all"] },
];

const List: React.FC<PropsWithChildren & ListProps> = ({
  children,
  title,
  noEntriesLabel = "no entries",
  hideViewSelector = false,
  initialView = "list",
  loadMore,
  hideLine = false,
}) => {
  const noChildren = useNoChildren(children);
  const [currentView, setView] = useState<ListView>(initialView);

  const className = useMemo(() => {
    switch (currentView) {
      case "list":
        return "space-y-4";
      case "grid":
        return "grid grid-cols-2 gap-4";
    }
  }, [currentView]);
  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <h2>{title}</h2>
        {!hideLine && title && !hideViewSelector && (
          <div className="flex-grow border-t border-stone-200 dark:border-stone-800 mx-4"></div>
        )}
        {!hideViewSelector && (
          <div className="space-x-2">
            {LIST_VIEWS.map((view) => {
              const selected = view.value === currentView;
              return (
                <button
                  type="button"
                  onClick={() => setView(view.value)}
                  key={view.value}
                >
                  <FontAwesomeIcon
                    icon={view.icon}
                    className={`text-xs ${
                      selected
                        ? "text-black dark:text-white"
                        : "text-stone-400 dark:text-stone-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {noChildren && <p>{noEntriesLabel}</p>}
      <div className={className}>{children}</div>
      {loadMore && (
        <div className="w-full flex justify-center mt-4">
          <Button
            disabled={loadMore.end}
            variant="plain"
            onClick={loadMore.action}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default List;

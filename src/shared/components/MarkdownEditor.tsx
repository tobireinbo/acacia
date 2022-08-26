import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Markdown from "src/shared/components/Markdown";
import Modal from "src/shared/components/Modal";
import {
  DetailedHTMLProps,
  TextareaHTMLAttributes,
  useMemo,
  useRef,
  useState,
} from "react";
import { Textarea } from "./Textarea";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const MarkdownEditor: React.FC<
  Pick<
    DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    "defaultValue" | "onChange" | "name"
  > & { label: string }
> = ({ defaultValue, name, onChange, label }) => {
  const [_value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const valueAsString = useMemo(() => _value?.toString(), [_value]);

  const insertTextAtCursor = (before: string, after: string) => {
    if (ref.current) {
      const [startIndex, endIndex] = [
        ref.current.selectionStart,
        ref.current.selectionEnd,
      ];

      ref.current.setRangeText(before, startIndex, endIndex, "end");
      ref.current.focus();
      ref.current.setRangeText(
        after,
        startIndex + before.length,
        endIndex + before.length,
        "start"
      );
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {label}
        <div className="p-2 bg-stone-100 dark:bg-stone-800 flex items-center space-x-2 rounded">
          <FontAwesomeIcon
            icon={["fas", "pen"]}
            className="text-stone-400 dark:text-stone-600 text-base"
          />
          <div>
            {valueAsString?.substring(0, 100)}
            {valueAsString && valueAsString.length > 100 && "..."}
          </div>
        </div>
      </div>
      <textarea className="w-full hidden" readOnly name={name} value={_value} />
      {open && (
        <Modal fullScreen onOutsideClick={() => setOpen(false)}>
          <div
            className="flex w-full h-full divide-x divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900 p-4 rounded"
            style={{ maxHeight: "calc(100vh - 8rem)", minHeight: "400px" }}
          >
            <div className="w-[50%] pr-4 h-full flex flex-col">
              <div className="flex flex-wrap pb-1">
                <ToolButton
                  onClick={() => insertTextAtCursor("**", "**")}
                  icon={["fas", "bold"]}
                />

                <ToolButton
                  onClick={() => insertTextAtCursor("*", "*")}
                  icon={["fas", "italic"]}
                />
                <ToolButton
                  onClick={() => insertTextAtCursor("# ", "")}
                  icon={["fas", "heading"]}
                />
              </div>
              <Textarea
                ref={ref}
                spellCheck={false}
                className="w-full h-full"
                value={_value}
                onChange={(e) => {
                  onChange?.(e);
                  setValue(e.target.value);
                }}
              ></Textarea>
            </div>
            <div className="w-[50%] pl-4">
              <div className="p-2 w-full h-full overflow-y-auto">
                <Markdown src={_value?.toString() || ""} />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MarkdownEditor;

const ToolButton: React.FC<{ onClick: () => void; icon: IconProp }> = ({
  onClick,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="bg-white hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-800 w-6 h-6 rounded flex items-center justify-center group"
    >
      <FontAwesomeIcon
        icon={icon}
        className="text-sm text-stone-400 dark:text-stone-500 group-hover:text-black dark:group-hover:text-white"
      />
    </button>
  );
};

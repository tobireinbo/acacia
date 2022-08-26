import Button from "src/shared/components/Button";
import React, { PropsWithChildren } from "react";

interface DialogueProps {
  onConfirm?: () => void;
  onCancel?: () => void;
}

const Dialogue: React.FC<PropsWithChildren<DialogueProps>> = ({
  children,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 rounded p-4 space-y-2">
      {children}
      <div className="flex space-x-2">
        <Button onClick={onConfirm}>Confirm</Button>
        <Button variant="plain" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Dialogue;

import useCounter from "src/shared/hooks/useCounter";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";

export type SystemMessage = {
  message: string;
};

export type SystemMessengerProps = {
  messages: Array<SystemMessage>;
  onChange: (messages: Array<SystemMessage>) => void;
};

const SystemMessenger: React.FC<SystemMessengerProps> = ({
  messages,
  onChange,
}) => {
  return (
    <div className="fixed top-8 right-10 z-30 flex flex-col-reverse">
      {messages.map((message, index) => (
        <Message key={index}>{message.message}</Message>
      ))}
    </div>
  );
};

export default SystemMessenger;

const maxAge = 1000;

const Message: React.FC<PropsWithChildren> = ({ children }) => {
  const [disabled, setDisabled] = useState(false);
  const counter = useCounter(0, false, 1);

  const percentage = useMemo(() => {
    return 100 - Math.ceil((counter / maxAge) * 100);
  }, [counter]);

  useEffect(() => {
    if (counter === maxAge) {
      setDisabled(true);
    }
  }, [counter]);

  if (disabled) {
    return null;
  }
  return (
    <div className="bg-stone-100 dark:bg-stone-800 last:mt-0 mt-2 overflow-hidden relative p-4 shadow-lg border rounded border-stone-200 dark:border-stone-700">
      {children}
      <div
        style={{
          left: 0,
          right: percentage,
          bottom: 0,
        }}
        className="absolute bg-primary h-0.5 "
      />
    </div>
  );
};

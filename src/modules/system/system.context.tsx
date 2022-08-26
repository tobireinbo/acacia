import Dialogue from "src/shared/components/Dialogue";
import Modal from "src/shared/components/Modal";
import SystemMessenger from "src/shared/components/SystemMessenger";
import { SystemMessage } from "src/shared/components/SystemMessenger";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";

type InjectableDialogue = {
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type InjectableModal = {
  element: ReactElement;
  onOutsideClick?: () => void;
};

interface ContextProps {
  //states
  //functions
  injectDialogue: (args: InjectableDialogue) => void;
  injectModal: (args: InjectableModal) => void;
  addMessage: (message: SystemMessage) => void;
  toggleTheme: (darkmode?: boolean) => void;
}

const createDefault = (): ContextProps => ({
  //states
  //functions
  injectDialogue: () => {},
  injectModal: () => {},
  addMessage: () => {},
  toggleTheme: () => {},
});

export const SystemContext = React.createContext<ContextProps>(createDefault());

export const SystemProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [dialogue, setDialogue] = useState<InjectableDialogue>();
  const [modal, setModal] = useState<InjectableModal>();
  const [systemMessages, setSystemMessages] = useState<Array<SystemMessage>>(
    []
  );

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("dark") === "true";
    toggleTheme(savedDarkMode);
  }, []);

  const injectDialogue: ContextProps["injectDialogue"] = (args) => {
    setDialogue(args);
  };

  const injectModal: ContextProps["injectModal"] = (args) => {
    setModal(args);
  };

  const addMessage: ContextProps["addMessage"] = (args) => {
    setSystemMessages((prev) => prev.concat(args));
  };

  const toggleTheme: ContextProps["toggleTheme"] = (darkmode) => {
    const html = document.documentElement;
    const add = () => {
      html.classList.add("dark");
      localStorage.setItem("dark", "true");
    };
    const remove = () => {
      html.classList.remove("dark");
      localStorage.removeItem("dark");
    };
    const isDarkmode = html.classList.contains("dark");
    if (darkmode !== undefined) {
      if (!darkmode) {
        remove();
      } else {
        add();
      }
    } else {
      if (isDarkmode) {
        remove();
      } else {
        add();
      }
    }
  };

  return (
    <SystemContext.Provider
      value={{ injectDialogue, injectModal, addMessage, toggleTheme }}
    >
      {children}

      {dialogue && (
        <Modal>
          <Dialogue
            onCancel={() => {
              dialogue.onCancel?.();
              setDialogue(undefined);
            }}
            onConfirm={() => {
              dialogue.onConfirm?.();
              setDialogue(undefined);
            }}
          >
            <p>{dialogue.message}</p>
          </Dialogue>
        </Modal>
      )}
      {modal && (
        <Modal
          onOutsideClick={() => {
            modal.onOutsideClick?.();
            setModal(undefined);
          }}
        >
          {modal.element}
        </Modal>
      )}
      <SystemMessenger messages={systemMessages} onChange={() => {}} />
    </SystemContext.Provider>
  );
};
export const useSystem = () => React.useContext(SystemContext);

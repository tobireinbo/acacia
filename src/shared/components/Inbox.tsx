import { useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useMemo, useRef, useState } from "react";
import { useAuth } from "src/modules/auth/auth.context";
import {
  PopulatedMessage,
  Message,
} from "src/modules/messages/interfaces/message.interface";
import { CREATE_MESSAGE } from "src/modules/messages/queries/create-message.query";
import { FIND_MESSAGES_DETAILED } from "src/modules/messages/queries/find-messages-detailed.query";
import { UPDATE_MESSAGE } from "src/modules/messages/queries/update-message.query";
import useOutsideClick from "../hooks/useOutsideClick";
import { IconLink } from "../layouts/DashboardLayout";
import Avatar from "./Avatar";
import IconButton from "./IconButton";
import LoadingOverlay from "./LoadingOverlay";
import Modal from "./Modal";
import Tabs from "./Tabs";
import { Textarea } from "./Textarea";
import { produce } from "immer";
import { useSystem } from "src/modules/system/system.context";
import UsersSearch from "./UsersSearch";

const Inbox: React.FC = () => {
  const { user } = useAuth();
  const { addMessage } = useSystem();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  const findMessages = useQuery<{ messages: Array<PopulatedMessage> }>(
    FIND_MESSAGES_DETAILED,
    {
      variables: {
        where: {
          OR: [
            {
              recipient: {
                uuid: user?.uuid,
              },
            },
            {
              sender: {
                uuid: user?.uuid,
              },
            },
          ],
        },
      },
      skip: !user,
    }
  );

  const [createMessage, createMessageResult] = useMutation<{
    createMessages: {
      messages: Array<Message>;
    };
  }>(CREATE_MESSAGE);
  const [updateMessage, updateMessageResult] = useMutation<{
    updateMessages: {
      messages: Array<Message>;
    };
  }>(UPDATE_MESSAGE);

  const [receivedMessages, sentMessages, count] = useMemo(() => {
    if (!findMessages.data) {
      return [];
    }
    const received = [];
    const sent = [];
    let count = 0;
    for (const message of findMessages.data?.messages) {
      if (message.recipient?.uuid === user?.uuid) {
        if (!message.read) {
          count += 1;
        }
        received.push(message);
      }

      if (message.sender?.uuid === user?.uuid) {
        sent.push(message);
      }
    }

    return [received, sent, count];
  }, [findMessages.data, user]);

  const [selectedMessage, setSelectedMessage] = useState<PopulatedMessage>();

  const markAsRead = (message: PopulatedMessage) => {
    updateMessage({
      variables: {
        where: {
          uuid: message.uuid,
        },
        update: {
          read: true,
        },
      },
      update: (cache, { data }) => {
        const updatedMessage = data?.updateMessages.messages[0];
        if (!updatedMessage) {
          return;
        }

        cache.modify({
          fields: {
            messages: (cachedMessages: Array<PopulatedMessage> = []) => {
              return produce(cachedMessages, (draft) => {
                const index = draft.findIndex(
                  (msg) => msg.uuid === updatedMessage?.uuid
                );
                draft[index] = { ...draft[index], read: true };
              });
            },
          },
        });
      },
    })
      .then((res) => {})
      .catch((err) => {});
  };

  const handleSendMessage = (e: FormEvent<any>) => {
    e.preventDefault();

    if (!user?.uuid) {
      return;
    }

    const body = {
      content: e.currentTarget.message.value,
      recipientUuid: e.currentTarget.recipient.value,
    };

    createMessage({
      variables: {
        input: [
          {
            content: body.content,
            recipient: {
              connect: {
                where: {
                  node: {
                    uuid: body.recipientUuid,
                  },
                },
              },
            },
            sender: {
              connect: {
                where: {
                  node: {
                    uuid: user?.uuid,
                  },
                },
              },
            },
          },
        ],
      },
      update: (cache, { data }) => {
        const newMessage = data?.createMessages.messages[0];
        if (!newMessage) {
          return;
        }
        cache.modify({
          fields: {
            messages: (cachedMessages = []) => {
              return [...cachedMessages, newMessage];
            },
          },
        });
      },
    })
      .then((res) => {
        if (res.data) {
          formRef.current?.reset();
          addMessage({ message: "Message Sent" });
        }
      })
      .catch((err) => {
        addMessage({ message: "Failed To Send Message" });
      });
  };

  return (
    <div>
      <div
        className="relative"
        onClick={() => {
          setOpen((prev) => true);
        }}
      >
        {count !== undefined && count > 0 && (
          <div className="absolute -top-2 -right-2 flex items-center justify-center text-xs w-6 h-6 rounded-full bg-secondary-light border border-secondary">
            {count}
          </div>
        )}
        <IconLink icon={["fas", "message"]} />
      </div>
      {open && (
        <Modal fullScreen>
          <div className="w-full h-full flex justify-center">
            <div
              ref={ref}
              className="bg-white dark:bg-stone-900 rounded flex overflow-hidden h-full w-full max-w-5xl"
            >
              <div className="flex flex-col border-r border-stone-200 dark:border-stone-700 h-full">
                <Tabs
                  tabs={[
                    {
                      element: (
                        <>
                          {!receivedMessages ||
                            (receivedMessages?.length < 1 && (
                              <p className="p-2">No Messages</p>
                            ))}
                          {receivedMessages?.map((msg) => (
                            <div
                              className={msg.read ? "opacity-50" : ""}
                              key={msg.uuid}
                            >
                              <ListedMessage
                                message={msg}
                                onClick={() => {
                                  if (!msg.read) {
                                    markAsRead(msg);
                                  }
                                  setSelectedMessage(msg);
                                }}
                                selected={selectedMessage?.uuid === msg.uuid}
                              />
                            </div>
                          ))}
                        </>
                      ),
                      title: <FontAwesomeIcon icon={["fas", "inbox"]} />,
                    },
                    {
                      element: (
                        <>
                          {!sentMessages ||
                            (sentMessages.length < 1 && (
                              <p className="p-2">No Messages</p>
                            ))}
                          {sentMessages?.map((msg) => (
                            <ListedMessage
                              key={msg.uuid}
                              message={msg}
                              onClick={() => setSelectedMessage(msg)}
                              selected={selectedMessage?.uuid === msg.uuid}
                            />
                          ))}
                        </>
                      ),
                      title: <FontAwesomeIcon icon={["fas", "envelope"]} />,
                    },
                    {
                      element: (
                        <LoadingOverlay loading={createMessageResult.loading}>
                          <form
                            ref={formRef}
                            className="p-2 space-y-2"
                            onSubmit={handleSendMessage}
                          >
                            <UsersSearch
                              label="Recipient"
                              required
                              name="recipient"
                            />

                            <Textarea
                              label="Content"
                              required
                              className="w-full h-96"
                              name="message"
                            />
                            <IconButton icon={["fas", "paper-plane"]}>
                              Send
                            </IconButton>
                          </form>
                        </LoadingOverlay>
                      ),
                      title: <FontAwesomeIcon icon={["fas", "pen"]} />,
                    },
                  ]}
                  className="w-72 overflow-y-auto"
                />
              </div>
              <div className="p-2 w-full">
                <MessageViewer message={selectedMessage} />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Inbox;

const ListedMessage: React.FC<{
  message: PopulatedMessage;
  selected?: boolean;
  onClick: () => void;
}> = ({ message, selected = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${
        selected
          ? "bg-stone-200 dark:bg-stone-700"
          : "bg-white dark:bg-stone-900"
      } p-2 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer`}
    >
      <h5>{message.sender?.firstname + " " + message.sender?.lastname}</h5>
      <p>
        {message.content.substring(0, 30)}
        {message.content.length > 30 && "..."}
      </p>
    </div>
  );
};

const MessageViewer: React.FC<{ message: PopulatedMessage | undefined }> = ({
  message,
}) => {
  return (
    <div className="p-2 space-y-4 bg-stone-100 dark:bg-stone-800 rounded h-full w-full">
      {message?.sender && message.recipient && (
        <div className="flex space-x-2 items-center justify-between">
          <div className="flex space-x-2 items-center">
            <Avatar user={message?.sender} />
            <h3>{message.sender.firstname + " " + message.sender.lastname}</h3>
          </div>
          <FontAwesomeIcon icon={["fas", "arrow-right-long"]} />
          <div className="flex space-x-2 items-center">
            <h3>
              {message.recipient.firstname + " " + message.recipient.lastname}
            </h3>
            <Avatar user={message?.recipient} />
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <p className="px-4 max-w-[75ch]">
          {!message ? "No Message" : message?.content}
        </p>
      </div>
    </div>
  );
};

/*
IDEA:
┌──────────────────────────────┬───────────────────────────────────────────────────────┐
│                              │                                                       │
│  Received     Sent     Read  │   ┌───┐                                               │
│                              │   │   │ John Doe                                      │
├──────────────────────────────┘   └───┘                                               │
│                                                                                      │
│  John Doe                        Hey There I've got a quick question                 │
│                                                                                      │
│  Hey There I've got a qu...      How do I center a div?                              │
│                                                                                      │
├──────────────────────────────┐                                                       │
│                              │                                                       │
│  Mark Zuckerberg             │   Thanks in Advance                                   │
│                              │                                                       │
│  How are you doing Human     │   Best Regards                                        │
│                              │                                                       │
├──────────────────────────────┤   John Doe                                            │
│                              │                                                       │
│  _____ _______               │                                                       │
│                              │                                                       │
│  ____ __ _____ ____ ____     │                                                       │
│                              │                                                       │
├──────────────────────────────┤                                                       │
│                              │                                                       │
│  _______ __________          │                                                       │
│                              │                                                       │
│  ______ _____ __ _____       │                                           Reply >     │
│                              │                                                       │
└──────────────────────────────┴───────────────────────────────────────────────────────┘
 */

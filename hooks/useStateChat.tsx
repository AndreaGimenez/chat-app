import { mockedChatHistory } from "@/assets/chatHistory";
import { useCallback, useState } from "react";
import { IMessage } from "react-native-gifted-chat";

export const useStateChat = () => {
  const [messages, setMessages] =
    useState<Record<string, IMessage[]>>(mockedChatHistory);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [currentOpenChat, setCurrentOpenChat] = useState<string>("");

  const addMessage = useCallback(
    (jid: string, message: IMessage, isIncoming = false) => {
      setMessages((prev) => {
        const existing = prev[jid] || [];
        return {
          ...prev,
          [jid]: [message, ...existing],
        };
      });

      setUnread((prev) => {
        if (isIncoming && jid !== currentOpenChat) {
          return {
            ...prev,
            [jid]: (prev[jid] || 0) + 1,
          };
        }
        return prev;
      });
    },
    [currentOpenChat]
  );

  //For the red badge when we user has unread messsages
  const clearUnread = useCallback((jid: string) => {
    setUnread((prev) => ({ ...prev, [jid]: 0 }));
  }, []);

  const getMessages = useCallback(
    (jid: string) => messages[jid] || [],
    [messages]
  );

  return {
    messages,
    unread,
    addMessage,
    getMessages,
    clearUnread,
    currentOpenChatJid: currentOpenChat,
    setCurrentOpenChatJid: setCurrentOpenChat,
  };
};

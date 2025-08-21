import { createContext } from "react";
import { IMessage } from "react-native-gifted-chat";

export interface Message {
  id: string;
  from: string;
  body: string;
  timestamp: Date;
}

interface MessageContextProps {
  messages: Record<string, IMessage[]>;
  unread: Record<string, number>;
  addMessage: (jid: string, message: IMessage, isIncoming?: boolean) => void;
  getMessages: (jid: string) => IMessage[];
  clearUnread: (jid: string) => void;
  currentOpenChatJid: string;
  setCurrentOpenChatJid: (jid: string) => void;
}

export const MessageContext = createContext<MessageContextProps>({
  messages: {},
  unread: {},
  addMessage: () => {},
  getMessages: () => [],
  clearUnread: () => {},
  currentOpenChatJid: "",
  setCurrentOpenChatJid: () => {},
});

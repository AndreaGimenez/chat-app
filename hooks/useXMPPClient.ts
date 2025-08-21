import { parseJid } from "@/assets/utils";
import { ClientContext } from "@/context/clientContext";
import { MessageContext } from "@/context/messageContext";
import { notifyNewMessage } from "@/notifications/send";
import { useContext, useEffect, useRef, useState } from "react";
import Config from "react-native-config";
import { IMessage } from "react-native-gifted-chat";
import { createClient } from "stanza";

interface XMPPClientProps {
  jid: string;
  password: string;
}

export const useXMPPClient = ({ jid, password }: XMPPClientProps) => {
  const [connected, setConnected] = useState(false);
  const { addMessage, currentOpenChatJid } = useContext(MessageContext);
  const { setClient } = useContext(ClientContext);
  const ip = Config.XMPP_HOST;
  // To avoid stale closures
  const openChatRef = useRef(currentOpenChatJid);
  const addMessageRef = useRef(addMessage);

  //keep the refs up to date
  useEffect(() => {
    openChatRef.current = currentOpenChatJid;
    addMessageRef.current = addMessage;
  }, [currentOpenChatJid, addMessage]);

  useEffect(() => {
    if (!jid || !password) return;
    const client = createClient({
      jid,
      password,
      resource: "rnclient",
      transports: {
        websocket: `ws://${ip}:5280/ws`,
        bosh: false,
      },
    });

    setClient(client);

    client.on("session:started", () => {
      client.sendPresence();
      setConnected(true);
    });

    client.on("disconnected", () => {
      console.log("❌ Disconnected from XMPP server");
      setConnected(false);
    });

    //Listen to incoming messages
    client.on("message", (msg) => {
      if (msg.body) {
        const giftedMsg: IMessage = {
          _id: Date.now().toString(),
          text: msg.body,
          createdAt: new Date(),
          user: {
            _id: msg.from || "unknown",
            name: msg.from ? parseJid(msg.from) : "Anonymous",
          },
        };

        // addMessage(msg.from, giftedMsg, true);
        addMessageRef.current(msg.from, giftedMsg, true);

        // only show notification if chat with this user is not open
        if (openChatRef.current !== msg.from) {
          notifyNewMessage(msg.from, msg.body);
        }
      }
    });

    client.connect();

    return () => {
      client.disconnect();
      setConnected(false);
    };
  }, [jid, password, ip, setClient]);
  return { connected };
};

import { ClientContext } from "@/context/clientContext";
import { MessageContext } from "@/context/messageContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, {
  FC,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { TouchableOpacity } from "react-native";
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { Message } from "stanza/protocol";

const Chat: FC = () => {
  const { client } = useContext(ClientContext);
  const { messages, addMessage, clearUnread, setCurrentOpenChatJid } =
    useContext(MessageContext);

  const router = useRouter();
  const navigation = useNavigation();
  const { chatWith } = useLocalSearchParams<{ chatWith: string }>();
  const jid = useMemo(() => `${chatWith}@localhost/rnclient`, [chatWith]);

  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const thisChatMessages: IMessage[] = [
    ...(messages["user1@localhost/rnclient"] || []),
    ...(messages["user2@localhost/rnclient"] || []),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Update header title dynamically
  useLayoutEffect(() => {
    if (chatWith) {
      navigation.setOptions({ title: chatWith });
      setCurrentOpenChatJid(jid);
    }
  }, [navigation, chatWith]);

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      if (!client) return;

      const msg = newMessages[0];
      if (!msg) return;

      const otherUserJid =
        client.jid === "user1@localhost/rnclient"
          ? "user2@localhost/rnclient"
          : "user1@localhost/rnclient";

      // send message via XMPP
      if (client) {
        client.sendMessage({
          to: otherUserJid,
          body: msg.text,
          from: client.jid,
        });
      }

      addMessage(jid, {
        ...msg,
        user: { _id: client.jid },
      });
    },
    [client, addMessage]
  );

  useFocusEffect(
    useCallback(() => {
      // ✅ Screen is focused
      clearUnread(jid);
      setCurrentOpenChatJid(jid);

      return () => {
        // Screen is unfocused (user navigated away)
        setCurrentOpenChatJid("");
      };
    }, [jid])
  );

  useFocusEffect(
    useCallback(() => {
      if (!client) return;
      clearUnread(jid);
      const handler = (msg: Message) => {
        if (msg.chatState === "composing") {
          setTypingUsers((prev) => ({ ...prev, [msg.from ?? ""]: true }));
        } else if (msg.chatState === "paused" || msg.chatState === "active") {
          setTypingUsers((prev) => ({ ...prev, [msg.from ?? ""]: false }));
        }
      };

      client.on("message", handler);

      // Cleanup when leaving the screen
      return () => {
        client.off("message", handler);
        setTypingUsers({});
      };
    }, [client, jid])
  );

  if (!client) {
    router.back();
    return;
  }

  //Funtions related to typing functionality
  const sendChatState = (
    to: string,
    state: "active" | "composing" | "paused" | "inactive" | "gone"
  ) => {
    client.sendMessage({
      to,
      chatState: state,
    });
  };

  //To control show / not show of the animated dots when typing
  const onInputTextChanged = (text: string) => {
    if (!client) return;

    if (text.length > 0) {
      sendChatState(jid, "composing");
      //Debouncer
      let typingTimeout;
      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        sendChatState(jid, "paused");
      }, 2500);
    } else {
      sendChatState(jid, "paused");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GiftedChat
        messages={thisChatMessages}
        onSend={onSend}
        user={{ _id: client.jid }}
        isTyping={typingUsers[jid] || false}
        placeholder="Typ je bericht..."
        renderSend={(props) => (
          <Send {...props}>
            <TouchableOpacity
              style={{ marginRight: 10, marginBottom: 5 }}
              onPress={() =>
                props.onSend?.({ text: props?.text?.trim() }, true)
              }
            >
              <Ionicons name="send" size={28} color="#007AFF" />
            </TouchableOpacity>
          </Send>
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: "#f5f5f7",
              borderTopWidth: 0,
              paddingHorizontal: 8,
            }}
            primaryStyle={{ alignItems: "center" }}
          />
        )}
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputStyle={{
              backgroundColor: "white",
              borderRadius: 20,
              paddingHorizontal: 12,
              marginRight: 8,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            containerStyle={{
              left: { marginBottom: 10 }, // spacing for received
              right: { marginBottom: 10 }, // spacing for sent
            }}
            wrapperStyle={{
              right: {
                backgroundColor: "#007AFF",
              },
              left: {
                backgroundColor: "#E0E0E0",
              },
            }}
            textStyle={{
              right: { color: "#fff" },
              left: { color: "#000" },
            }}
          />
        )}
        onInputTextChanged={onInputTextChanged}
        isScrollToBottomEnabled={true}
        scrollToBottomComponent={() => (
          <Feather name="chevrons-down" size={24} color="black" /> // or your own icon
        )}
      />
    </SafeAreaView>
  );
};

export default Chat;

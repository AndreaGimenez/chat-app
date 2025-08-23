import { parseJid } from "@/assets/utils";
import { UserStatusCircle } from "@/components/UserStatusCircle";
import { ClientContext } from "@/context/clientContext";
import { MessageContext } from "@/context/messageContext";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type Status = "online" | "offline" | "away";

const statusColors = {
  online: "green",
  offline: "grey",
  away: "orange",
} as const satisfies Record<Status, string>;

export default function HomeScreen() {
  const router = useRouter();
  const { client, setClient, roster } = useContext(ClientContext);
  const [presences, setPresences] = useState<Record<string, string>>({});
  const { unread } = useContext(MessageContext);

  useEffect(() => {
    if (!client) return;

    const handlePresence = (pres: any) => {
      // 1. Handle subscription requests
      if (pres.type === "subscribe") {
        client.sendPresence({
          to: pres.from,
          type: "subscribed",
        });
        client.sendPresence({
          to: pres.from,
          type: "subscribe",
        });
      }

      // 2. Track availability
      const jid = pres.from;
      const show = pres.show || "online"; // 'away', 'dnd', 'xa', or default 'online'
      const type = pres.type;

      setPresences((prev) => ({
        ...prev,
        [jid]: type === "unavailable" ? "offline" : show,
      }));
    };

    client.on("presence", handlePresence);

    // Add roster entry for the "other user"
    const otherUser =
      client.jid === "user1@localhost/rnclient"
        ? "user2@localhost/rnclient"
        : "user1@localhost/rnclient";

    client.sendIQ({
      type: "set",
      roster: {
        items: [
          {
            jid: otherUser,
            name: otherUser,
            groups: ["Buddies"],
          } as any, // 👈 bypass TS here
        ],
      },
    });

    // 👇 Request to receive presence from the other user
    client.sendPresence({
      to: otherUser,
      type: "subscribe",
    });

    return () => {
      client.removeListener("presence", handlePresence);
    };
  }, [client]);

  const onLogout = useCallback(async () => {
    if (!client) return;

    try {
      client.removeAllListeners();

      // Send unavailable presence if possible
      if (client.sessionStarted) {
        try {
          await client.sendPresence({ type: "unavailable" });
        } catch (e) {
          console.warn("Failed to send unavailable:", e);
        }
      }

      // Properly disconnect
      await client.disconnect();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setPresences({});
      setClient(null);
      router.navigate("/(tabs)");
    }
  }, [client]);

  const openChat = useCallback(
    (chatWith: string) => {
      router.push(`/${parseJid(chatWith)}`);
      return;
    },
    [router]
  );

  if (!client) {
    return <Text>no hay client</Text>;
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>Contactenlijst</Text>
        <View style={styles.spacerV} />
        {roster ? (
          roster.items.map((contact) => {
            const status = presences[contact.jid]
              ? presences[contact.jid]
              : "offline";
            return (
              <TouchableOpacity
                key={contact.jid}
                style={styles.contact}
                onPress={() => openChat(contact.jid)}
              >
                <UserStatusCircle color={statusColors[status as Status]} />
                <View style={styles.spacerH} />
                <Text>
                  {contact.jid} - {status}
                </Text>
                {unread[contact.jid] > 0 && (
                  <View
                    style={{
                      backgroundColor: "red",
                      borderRadius: 12,
                      paddingHorizontal: 6,
                      marginLeft: 8,
                    }}
                  >
                    <Text style={{ color: "white" }}>
                      {unread[contact.jid]}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        ) : (
          <Text>You have no contacts yet</Text>
        )}
      </View>
      <Button title="log out" onPress={onLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  contact: {
    flexDirection: "row",
    marginBottom: 16,
  },
  spacerH: {
    width: 16,
  },
  spacerV: {
    height: 16,
  },
});

import { useXMPPClient } from "@/hooks/useXMPPClient";
import { useRouter } from "expo-router";
import { FC, useCallback, useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

//Currently we are not using this screen

const LoginScreen: FC = () => {
  const [jid, setJid] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const { connected, badCredentials } = useXMPPClient({
    credentials: { jid, password },
  });

  const handleLogin = useCallback(() => {
    if (!jid || !password) {
      setStatus("Please fill both fields");
      return;
    }
  }, [jid, password]);

  useEffect(() => {
    if (badCredentials) {
      setStatus("Username or password not correct");
    }
    if (connected) {
      router.navigate("/(tabs)");
    }
  }, [badCredentials, connected, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="user@example.com"
        value={jid}
        onChangeText={setJid}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  label: { marginBottom: 4, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
  status: { marginTop: 10, textAlign: "center" },
});

export default LoginScreen;

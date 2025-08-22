import { AuthContext } from "@/context/AuthContext";
import { ClientContext } from "@/context/clientContext";
import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useState } from "react";
import "react-native-get-random-values";
import "react-native-reanimated";
import { Agent } from "stanza";
import { RosterResult } from "stanza/protocol";
import Login from "./login";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const authState = useAuth();
  const [client, setClient] = useState<Agent | null>(null);
  const [roster, setRoster] = useState<RosterResult>({ items: [] });

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthContext.Provider value={authState}>
        <ClientContext.Provider
          value={{ client, setClient, roster, setRoster }}
        >
          {authState.isLoggedIn ? <RootLayoutNav /> : <Login />}
        </ClientContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  // Always use light theme regardless of system setting
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

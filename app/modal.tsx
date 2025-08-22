import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

// import EditScreenInfo from "@/components/EditScreenInfo";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="#eee" /> */}
      {/* <EditScreenInfo path="app/modal.tsx" /> */}

      {/* Use a dark status bar for light theme */}
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff", // Force white background
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

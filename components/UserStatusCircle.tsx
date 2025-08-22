import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

interface StatusColors {
  color: "green" | "grey" | "orange";
}

export const UserStatusCircle: FC<StatusColors> = ({ color }) => {
  return <View style={[styles.status, { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
  status: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

import * as Notifications from "expo-notifications";

export const notifyNewMessage = async (from: string, text: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `New message from ${from}`,
      body: text,
      sound: true,
      data: { from },
    },
    trigger: null,
  });
};

import * as Notifications from "expo-notifications";

// Configure how notifications are displayed when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request permissions once
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status === "denied") {
    alert("Permission for notifications not granted!");
  }
};

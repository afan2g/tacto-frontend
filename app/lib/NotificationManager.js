import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export class NotificationManager {
  static async registerForPushNotifications() {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        throw new Error("Permission not granted!");
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      // Save token to database
      const { error } = await supabase.from("notification_tokens").upsert(
        {
          user_id: supabase.auth.user()?.id,
          push_token: token.data,
          device_type: Platform.OS,
          last_used: new Date().toISOString(),
        },
        {
          onConflict: "user_id, push_token",
          update: ["last_used"],
        }
      );

      if (error) throw error;

      // Configure notification handling
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      return token;
    } catch (error) {
      console.error("Error registering for push notifications:", error);
      throw error;
    }
  }
}

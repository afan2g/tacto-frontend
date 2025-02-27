// NotificationTest.tsx
import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { supabase } from '../../lib/supabase'; // Adjust path as needed
import Constants from 'expo-constants';
import { useAuthContext } from '../contexts';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationsTest() {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const {session} = useAuthContext();
  useEffect(() => {
    registerForPushNotifications();

    // Listen for incoming notifications when app is foregrounded
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      notification => {
        const notifData = notification.request.content.data;
        setNotification(JSON.stringify(notifData));
      }
    );

    // Listen for notification responses (when user taps notification)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification tapped:', response);
      }
    );

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      const {data, error: retrieveTokenError } = await supabase.from('notification_tokens').select('push_token').eq('user_id', session.user.id).maybeSingle();
      if (retrieveTokenError) throw retrieveTokenError;
      if (data) {
        setPushToken(data.push_token);
        return;
      }
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId
      });
      
      const token = tokenData.data;
      setPushToken(token);

      // Save token to database
      const { error } = await supabase
        .from('notification_tokens')
        .upsert({
          user_id: (await supabase.auth.getUser())?.data.user.id,
          push_token: token,
          device_type: Platform.OS,
          last_used: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  };

  const testNotification = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('test-notification', {
        body: { pushToken }
      });

      if (error) throw error;
      console.log('Test notification sent:', data);
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Push Token: {pushToken ?? 'None'}</Text>
      <Button 
        title="Test Notification" 
        onPress={testNotification}
        disabled={!pushToken}
      />
      {notification && (
        <Text style={styles.notification}>
          Last notification: {notification}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 20,
  },
  notification: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});
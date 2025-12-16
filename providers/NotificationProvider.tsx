import messaging from '@react-native-firebase/messaging';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { StreamChat } from 'stream-chat';
import { useAuth } from './AuthProvide';

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_API_KEY!);

export default function NotificationProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { user } = useAuth();

  const requestPermission = async () => {
    // Request permission for Android 13 and above
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return;
    }
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  useEffect(() => {
    const registerPushToken = async () => {
      const token = await messaging().getToken();
      const push_provider = 'firebase';
      const push_provider_name = 'Firebase';
      client.addDevice(token, push_provider, user!.id, push_provider_name);

      // const push_provider_name = 'Firebase';
      // client.setLocalDevice({
      //   id: token,
      //   push_provider,
      //   push_provider_name,
      // });
    };

    const init = async () => {
      await requestPermission();
      await registerPushToken();

      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}

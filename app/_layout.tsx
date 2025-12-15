import AuthProvider from '@/providers/AuthProvide';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import 'stream-chat-expo';

export default function RootLayout() {
  useEffect(() => {
    const run = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          'android.permission.POST_NOTIFICATIONS',
          'android.permission.BLUETOOTH_CONNECT',
        ]);
      }
    };
    run();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

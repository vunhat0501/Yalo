import AuthProvider from '@/providers/AuthProvide';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <Slot />;
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

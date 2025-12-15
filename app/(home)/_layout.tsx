import { useAuth } from '@/providers/AuthProvide';
import ChatProvider from '@/providers/ChatProvider';
import VideoProvider from '@/providers/VideoProvide';
import { Redirect, Stack } from 'expo-router';

export default function HomeLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ChatProvider>
      <VideoProvider>
      <Stack>
        <Stack.Screen name="call/index" />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      </VideoProvider>
    </ChatProvider>
  );
}

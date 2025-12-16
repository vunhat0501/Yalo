import { useAuth } from '@/providers/AuthProvide';
import CallProvider from '@/providers/CallProvider';
import ChatProvider from '@/providers/ChatProvider';
import NotificationProvider from '@/providers/NotificationProvider';
import VideoProvider from '@/providers/VideoProvide';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ChatProvider>
      <NotificationProvider>
        <VideoProvider>
          <CallProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </CallProvider>
        </VideoProvider>
      </NotificationProvider>
    </ChatProvider>
  );
}

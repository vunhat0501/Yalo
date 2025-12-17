import { useAuth } from '@/providers/AuthProvide';
import CallProvider from '@/providers/CallProvider';
import ChatProvider from '@/providers/ChatProvider';
import NotificationProvider from '@/providers/NotificationProvider';
import VideoProvider from '@/providers/VideoProvide';
import { CallingState, useCalls } from '@stream-io/video-react-native-sdk';
import { Redirect, router, Stack } from 'expo-router';
import React, { useEffect } from 'react';

// 1. Create a separate component to listen for calls
// This component will be INSIDE the provider, so useCalls() will work.
const IncomingCallListener = () => {
  const calls = useCalls();

  useEffect(() => {
    const incomingCall = calls.find(
      (call) => call.state.callingState === CallingState.RINGING
    );

    if (incomingCall) {
      router.push({
        pathname: '/call',
        params: { id: incomingCall.id },
      });
    }
  }, [calls]);

  return null; // This component doesn't render anything visible
};

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
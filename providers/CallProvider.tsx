import { CallingState, useCalls } from '@stream-io/video-react-native-sdk'; // <--- Import CallingState
import { router, useSegments } from 'expo-router';
import React, { PropsWithChildren, useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CallProvider({ children }: PropsWithChildren) {
  const calls = useCalls();
  const call = calls[0];
  const { top } = useSafeAreaInsets();
  const segments = useSegments();

  const isOnCallScreen = segments[1] === 'call';

  useEffect(() => {
    if (!call) {
      return;
    }
   console.log(call.state.callingState) 
    // Only redirect if explicitly ringing and not already there
    if (!isOnCallScreen && call.state.callingState === CallingState.RINGING) {
      router.push(`/call`);

    }
  }, [call, isOnCallScreen]);

  // --- LOGIC CHANGE HERE ---
  // Define what constitutes an "Active" call that needs a banner.
  // We exclude IDLE, LEFT, OFFLINE, etc.
  const isCallActive =
    call &&
    (call.state.callingState === CallingState.RINGING ||
     call.state.callingState === CallingState.JOINED);

  return (
    <>
      {children}
      {/* Change condition to use isCallActive instead of just call */}
      {isCallActive && !isOnCallScreen && (
        <Pressable
          onPress={() => router.push(`/call`)}
          style={{
            position: 'absolute',
            backgroundColor: 'lightgreen',
            top: top + 40,
            left: 0,
            right: 0,
            padding: 10,
            zIndex: 100, // Good to add zIndex to ensure it sits on top
          }}
        >
          <Text>
            Return to Call: {call?.id.substring(0, 8)}... ({call.state.callingState})
          </Text>
        </Pressable>
      )}
    </>
  );
}
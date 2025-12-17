// CallScreen.tsx
import {
  Call,
  CallContent,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View, Alert } from 'react-native';

export default function CallScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();

  const isJoiningRef = useRef(false);

  useEffect(() => {
    if (!client || !id || isJoiningRef.current) return;

    isJoiningRef.current = true;
    const _call = client.call('default', id);

    const joinCall = async () => {
      try {
        await _call.join({ create: true });
        setCall(_call);
      } catch (e: any) {
        console.log('Error joining call:', e);
        if (
          e.message?.includes('already joined') ||
          _call.state.callingState === CallingState.JOINED
        ) {
          setCall(_call);
        } else {
            // Optional: Handle fatal errors (e.g. navigate back)
            Alert.alert("Error", "Could not join call");
            router.back();
        }
      }
    };

    joinCall();

    return () => {
       // Cleanup if necessary
    };
  }, [client, id]);

  // --- NEW: Listen for when the call ends remotely ---
  useEffect(() => {
    if (!call) return;

    // This event fires when SOMEONE ELSE executes .endCall()
    const unsubscribe = call.on('call.ended', () => {
        console.log('The call was ended by the other user.');
        setCall(null);
        router.back();
    });

    return () => {
        unsubscribe();
    };
  }, [call]);

  if (!call) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Joining Call...</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <CallContent
        onHangupCallHandler={async () => {
            // --- UPDATED: Logic to end call for everyone ---
            try {
                // endCall() stops the session for ALL participants
                await call.endCall(); 
            } catch (e) {
                console.error("Failed to end call for everyone, leaving instead:", e);
                // Fallback: If user doesn't have permission to end, just leave
                await call.leave();
            }
            router.back();
        }}
      />
    </StreamCall>
  );
}
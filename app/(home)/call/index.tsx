import {
  Call,
  CallContent,
  CallingState,
  StreamCall,
  useCalls,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function CallScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();

  // Get list of active calls to check if we are already ringing
  const calls = useCalls();

  useEffect(() => {
    if (!client || !id) return;

    // 1. First, check if the SDK already knows about this call (e.g. it's ringing)
    // This prevents creating a duplicate instance
    let _call = calls.find(c => c.id === id);

    // 2. If not found in active calls, create a new instance (for the Caller)
    if (!_call) {
      _call = client.call('default', id);
    }

    // 3. Set the call state immediately so the UI loads
    setCall(_call);

    // 4. Join or Accept the call
    // If we are not already joined or in the process of joining...
    if (_call.state.callingState !== CallingState.JOINED) {
      _call.join({ create: true }).catch(err => {
        console.log('Error joining call:', err);
        // Handle permission errors or network errors here
      });
    }
  }, [client, id]); // Intentionally removed 'calls' to run this logic only on mount/id change

  if (!call) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Initializing Call...</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <CallContent
        onHangupCallHandler={() => {
          call.leave();
          router.back();
        }}
      />
    </StreamCall>
  );
}
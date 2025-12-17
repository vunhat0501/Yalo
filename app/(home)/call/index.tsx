import {
  RingingCallContent,

  StreamCall,

  useCalls,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";

import { router } from "expo-router";

import React, { useEffect, useRef } from "react";

import { ActivityIndicator, Text, View } from "react-native";
export default function CallScreen() {
  const calls = useCalls();
  const call = calls[0];
  const isLeaving = useRef(false);
  const isJoining = useRef(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  useEffect(() => {
    if (!call && !isLeaving.current) {
      isLeaving.current = true;
      setTimeout(() => {
        if (router.canGoBack()) router.back();
        else router.replace('/');
      }, 0);
      return;
    }
    if (!call) return;
    const joinAsync = async () => {
      const state = call.state.callingState;
      console.log("Trạng thái hiện tại:", state);
      if (state === 'joined' || state === 'joining' || isJoining.current) {
        return;
      }
      if (state === 'idle' || state === 'created') {
        try {
          isJoining.current = true;
          console.log("Bắt đầu tham gia cuộc gọi...");
          await call.join();
        } catch (e) {
          // Nếu lỗi là "Already joined" thì bỏ qua, không sao cả
          console.warn("Lỗi join (có thể do đã join rồi):", e);
        } finally {
          isJoining.current = false;
        }
      }
    };
    joinAsync();
    const subscription = call.state.callingState$.subscribe((state) => {
      if ((state === 'left' || state === 'ended') && !isLeaving.current) {
        isLeaving.current = true;
        setTimeout(() => {
          if (router.canGoBack()) router.back();
          else router.replace('/');
        }, 300);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [call]);
  if (!call) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={{ marginTop: 10 }}>Đang kết thúc cuộc gọi...</Text>
      </View>
    );
  }
  return (
    <StreamCall call={call}>
      <RingingCallContent
        onHangupCallHandler={async () => {
          try {
            await call.leave();
          } catch (e) {
            console.warn("Lỗi rời khỏi cuộc gọi:", e);
          }
        }}
      />
    </StreamCall>
  );
}
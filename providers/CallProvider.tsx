import { useCalls } from "@stream-io/video-react-native-sdk";
import { router, useSegments } from "expo-router";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CallProvider({ children }: PropsWithChildren) {
  const calls = useCalls();
  const call = calls[0];
  const { top } = useSafeAreaInsets();
  const segments = useSegments();
  
  // Kiểm tra an toàn hơn xem có đang ở màn hình call không
  const isOnCallScreen = segments.includes('call');
  const isNavigating = useRef(false);

  useEffect(() => {
    if (!call) {
      isNavigating.current = false;
      return;
    }

    const callingState = call.state.callingState;
    console.log("Trạng thái cuộc gọi hệ thống:", callingState);

    // Tự động chuyển màn hình khi có cuộc gọi đến (ringing)
    if (!isOnCallScreen && callingState === 'ringing' && !isNavigating.current) {
      isNavigating.current = true;
      router.push('/call');
    }

    // Reset flag khi cuộc gọi kết thúc
    if (callingState === 'ended' || callingState === 'left') {
      isNavigating.current = false;
    }
  }, [call?.state.callingState, isOnCallScreen]);

  return (
    <>
      {children}
      
      {/* Banner này xuất hiện khi bạn đang gọi mà lỡ thoát ra màn hình ngoài (giống Zalo) */}
      {call && !isOnCallScreen && (call.state.callingState === 'active' || call.state.callingState === 'ringing') && (
        <Pressable 
          onPress={() => router.push('/call')} 
          style={{
            position: 'absolute', 
            backgroundColor: '#4CAF50', // Màu xanh lá Zalo
            top: top, 
            left: 0, 
            right: 0, 
            padding: 12,
            zIndex: 9999,
            flexDirection: 'row',
            justifyContent: 'center'
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            📞 Cuộc gọi đang diễn ra - Chạm để quay lại
          </Text>
        </Pressable>
      )}
    </>
  );
}
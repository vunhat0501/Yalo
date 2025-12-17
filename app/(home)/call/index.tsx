// CallScreen.tsx
import {
  Call,
  CallContent,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react'; // <--- Thêm useRef
import { ActivityIndicator, Text, View } from 'react-native';

export default function CallScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();
  
  // Dùng ref để đánh dấu đã join hay chưa (tránh React Strict Mode chạy 2 lần)
  const isJoiningRef = useRef(false);

  useEffect(() => {
    if (!client || !id || isJoiningRef.current) return; // <--- Nếu đã join rồi thì return luôn

    // Đánh dấu đang xử lý
    isJoiningRef.current = true;

    // Tạo object call (Stream SDK sẽ tự trả về instance cũ nếu đã có)
    const _call = client.call('default', id);
    
    // Join cuộc gọi
    const joinCall = async () => {
        try {
            await _call.join({ create: true });
            setCall(_call); // Chỉ set state khi join thành công hoặc đã có object
        } catch (e) {
            console.log('Error joining call:', e);
            // Nếu lỗi do đã join rồi thì vẫn set call để hiển thị
            if (e.message?.includes('already joined') || _call.state.callingState === CallingState.JOINED) {
                 setCall(_call);
            }
        }
    };

    joinCall();

    // Cleanup function: Rời cuộc gọi khi component bị hủy (unmount)
    return () => {
        // Tùy chọn: Nếu bạn muốn thoát call khi back ra, hãy bỏ comment dòng dưới
        // _call.leave(); 
    };

  }, [client, id]);

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
        onHangupCallHandler={() => {
          call.leave();
          router.back();
        }}
      />
    </StreamCall>
  );
}
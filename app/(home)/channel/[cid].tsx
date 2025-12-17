import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';

import Zocial from '@expo/vector-icons/Zocial';
import * as Crypton from "expo-crypto";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View
} from 'react-native';
import {
  AttachButton,
  Channel,
  MessageInput,
  MessageList
} from 'stream-chat-react-native';
export default function ChannelScreen() {
  //* fetch and store complete channel id
  const [isJoiningCall, setIsJoiningCall] = useState(false);

  const joinCall = async () => {
    // Kiểm tra an toàn
    if (!videoClient || !channel || isJoiningCall) return;

    setIsJoiningCall(true);

    try {
      // 1. Lấy ID của chính mình (người gọi)
      // Dùng client.userID từ Chat SDK là an toàn nhất
      const currentUserId = client.userID;
      console.log("ID của chính mình:", currentUserId);

      // 2. Lọc danh sách thành viên (LOẠI BỎ CHÍNH MÌNH)
      const members = Object.values(channel.state.members)
        .filter((member) => (member.user?.id || member.user_id) !== currentUserId) // <--- Fix: Check both user.id and user_id
        .map((member) => ({
          user_id: member.user?.id || member.user_id
        }));

      console.log("Danh sách thành viên cần gọi (excluding me):", members);
      console.log("Số lượng thành viên:", members.length);
      // (Tuỳ chọn) Kiểm tra nếu không còn ai để gọi
      if (members.length === 0) {
        console.log("Không có ai khác trong phòng để gọi");
        // Bạn có thể return hoặc alert thông báo tuỳ ý
        setIsJoiningCall(false);
        return;
      }

      // Tạo ID ngẫu nhiên cho cuộc gọi
      const callId = Crypton.randomUUID().toLowerCase();
      const call = videoClient.call('default', callId);

      // 3. Khởi tạo cuộc gọi với danh sách đã lọc
      await call.getOrCreate({
        ring: true,
        data: {
          members: members // Chỉ chứa những người KHÁC
        },
      });

      // Lưu ý: Nếu bên màn hình /call bạn đã có logic tự động join, 
      // thì có thể bỏ dòng await call.join() ở đây đi để tránh join 2 lần.
      // Nếu chưa có thì giữ nguyên.
      // await call.join();
      // 
      router.push(`/call`);
    } catch (error) {
      console.error("Lỗi khởi tạo cuộc gọi:", error);
    } finally {
      setIsJoiningCall(false);
    }
  };
  useEffect(() => {
    const fetchChannel = async () => {
      const channels = await client.queryChannels({ cid });
      setChannel(channels[0]);
    };

    fetchChannel();
  }, [cid]);

  //* if no channel found, show loading icon
  if (!channel) {
    return <ActivityIndicator />;
  }

  return (
    <Channel channel={channel} AttachButton={AttachButton}>
      {/* Tranh keyboard che chat va input IOS
      Android duoc set o trong app.json phan softwareKeyboardLayoutMode */}
      <Stack.Screen options={{
        title: "chat",
        headerRight: () => isJoiningCall
          ? <ActivityIndicator size="small" color="black" />
          : <Zocial name="call" size={24} color="black" onPress={joinCall} />
      }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <MessageList />
        <View style={{ paddingBottom: bottom }}>
          <MessageInput />
        </View>
      </KeyboardAvoidingView>
    </Channel>
  );
}

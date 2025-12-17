// VideoProvide.tsx

import { tokenProvider } from "@/utils/tokenProvider";
import { PropsWithChildren, useEffect, useState } from "react";
// 👇 THÊM Text VÀO ĐÂY
import { ActivityIndicator, View, Text } from "react-native"; 
import { useAuth } from "./AuthProvide";
import { supabase } from "@/lib/supabase";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-native-sdk";
import React from "react";

export default function VideoProvider({ children }: PropsWithChildren) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  const { profile } = useAuth();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check cả profile lẫn apiKey
    if (!profile || !apiKey) {
      if (!apiKey) {
        console.error("LỖI: Biến môi trường EXPO_PUBLIC_API_KEY bị thiếu!");
        setHasError(true);
      }
      return;
    }

    let client: StreamVideoClient; // Tạo biến local để cleanup dễ hơn

    const initVideoClient = async () => {
      const avatarPath = profile.avatar_url || 'default-avatar.png';
      
      // Lấy URL ảnh an toàn hơn (handle trường hợp null)
      const { data } = supabase.storage.from('avatars').getPublicUrl(avatarPath);
      
      const user = {
        id: profile.id,
        name: profile.full_name || "User", // Fallback name
        image: data.publicUrl,
      };

      client = new StreamVideoClient({ apiKey, user, tokenProvider });
      setVideoClient(client);
    };

    initVideoClient();

    return () => {
      // Cleanup chính xác instance vừa tạo
      if (client) {
        console.log("Disconnecting video user...");
        client.disconnectUser();
      }
      // Set lại null để hiện loading nếu profile đổi
      setVideoClient(null); 
    };
  }, [profile?.id, apiKey]); // Thêm apiKey vào dependency cho chuẩn

  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Lỗi kết nối Stream. Kiểm tra API Key.</Text>
      </View>
    );
  }

  if (!videoClient) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
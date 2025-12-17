import { supabase } from '@/lib/supabase';
import { tokenProvider } from '@/utils/tokenProvider';
import {
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from './AuthProvide';

export default function VideoProvider({ children }: PropsWithChildren) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  const { profile } = useAuth();
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    if (!profile || !apiKey) {
      if (!apiKey) {
        console.error('LỖI: Biến môi trường EXPO_PUBLIC_API_KEY bị thiếu!');
        setHasError(true); // Đặt trạng thái lỗi
      }
      return;
    }

    const initVideoClient = async () => {
      const avatarPath = profile.avatar_url || 'default-avatar.png';
      const user = {
        id: profile.id,
        name: profile.full_name,
        image: supabase.storage.from('avatars').getPublicUrl(avatarPath).data
          .publicUrl,
      };
      const client = new StreamVideoClient({ apiKey, user, tokenProvider });
      setVideoClient(client);
    };
    initVideoClient();
    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [profile?.id]);
  if (hasError) {
    return (
      <View>
        <Text>Lỗi kết nối Stream. Vui lòng kiểm tra API Key.</Text>
      </View>
    );
  }
  if (!videoClient) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}

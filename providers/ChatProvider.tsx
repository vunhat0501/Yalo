import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvide';
import { tokenProvider } from '@/utils/tokenProvider';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-react-native';

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_API_KEY!);

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile) {
      return;
    }

    const connect = async () => {
      //** Ensure any previous connection is closed before starting a new one
      await client.disconnectUser();

      const avatarPath = profile.avatar_url || 'default-avatar.png';
      const imageUrl = supabase.storage.from('avatars').getPublicUrl(avatarPath)
        .data.publicUrl;

      try {
        await client.connectUser(
          {
            id: profile.id,
            name: profile.full_name,
            image: imageUrl,
          },
          tokenProvider
        );
        setIsReady(true);
      } catch (error) {
        return;
      }
    };

    connect();

    return () => {
      //** Ensures cleanup happens even if the connection was still "pending"
      client.disconnectUser();
      setIsReady(false);
    };
  }, [profile?.id]);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <OverlayProvider>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
}

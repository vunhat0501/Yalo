import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvide';
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
      const avatarPath = profile.avatar_url || 'default-avatar.png';
      const imageUrl = supabase.storage.from('avatars').getPublicUrl(avatarPath)
        .data.publicUrl;

      await client.connectUser(
        {
          id: profile.id,
          name: profile.full_name,
          image: imageUrl,
        },
        client.devToken(profile.id)
      );
      setIsReady(true);

      // const channel = client.channel('messaging', 'the_park', {
      //   name: 'The Park',
      // });
      // await channel.watch();
    };

    connect();

    //* Disconnect user (close WebSocket) when the component is unmount
    return () => {
      if (isReady) {
        client.disconnectUser();
      }
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

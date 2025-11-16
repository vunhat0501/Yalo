import { useAuth } from '@/providers/AuthProvide';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { ChannelList } from 'stream-chat-react-native';

export default function MainTabScreen() {
  const { user } = useAuth();

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <ChannelList
      filters={{ members: { $in: [user.id] } }}
      onSelect={channel => router.push(`/channel/${channel.cid}`)}
    />
  );
}

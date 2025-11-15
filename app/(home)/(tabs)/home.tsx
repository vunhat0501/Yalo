import { router } from 'expo-router';
import { ChannelList } from 'stream-chat-react-native';

export default function MainTabScreen() {
  return (
    <ChannelList onSelect={channel => router.push(`/channel/${channel.cid}`)} />
  );
}

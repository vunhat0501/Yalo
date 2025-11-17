import { useAuth } from '@/providers/AuthProvide';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, router, Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { ChannelList } from 'stream-chat-react-native';

export default function MainTabScreen() {
  const { user } = useAuth();

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href={'/(home)/users'} asChild>
              <FontAwesome5
                name="users"
                size={22}
                color="gray"
                style={{ marginHorizontal: 15 }}
              />
            </Link>
          ),
        }}
      />
      <ChannelList
        filters={{ members: { $in: [user.id] } }}
        onSelect={channel => router.push(`/channel/${channel.cid}`)}
      />
    </>
  );
}

import { useAuth } from '@/providers/AuthProvide';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useChatContext } from 'stream-chat-expo';

type UserListItemProps = {
  user: {
    full_name: string;
    id: string;
  };
};

const UserListItem = ({ user }: UserListItemProps) => {
  const { client } = useChatContext();
  const { user: me } = useAuth();

  const onPress = async () => {
    //* Start chatting with that account
    const channel = client.channel('messaging', {
      members: [me?.id!, user.id],
    });

    await channel.watch();
    router.push(`/(home)/channel/${channel.cid}`);
  };

  return (
    <Pressable
      onPress={onPress}
      style={{ padding: 10, backgroundColor: 'white' }}>
      <Text style={{ fontWeight: '600' }}>{user.full_name}</Text>
    </Pressable>
  );
};

export default UserListItem;

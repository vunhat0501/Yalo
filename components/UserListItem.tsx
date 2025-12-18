import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvide';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useChatContext } from 'stream-chat-expo';

type UserListItemProps = {
  user: {
    full_name: string;
    id: string;
    avatar_url?: string | null;
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

  const avatarSource = user.avatar_url
    ? {
        uri: supabase.storage.from('avatars').getPublicUrl(user.avatar_url).data
          .publicUrl,
      }
    : null;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Hiển thị Avatar hoặc Placeholder nếu không có ảnh */}
      {avatarSource ? (
        <Image source={avatarSource} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text style={styles.initials}>
            {user.full_name ? user.full_name[0].toUpperCase() : '?'}
          </Text>
        </View>
      )}

      <Text style={styles.name}>{user.full_name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'row', // Xếp ngang
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  placeholder: {
    backgroundColor: '#E1E1E1', // Màu nền xám nếu không có ảnh
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default UserListItem;

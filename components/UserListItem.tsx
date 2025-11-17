import React from 'react';
import { Text, View } from 'react-native';

type UserListItemProps = {
  user: {
    full_name: string;
  };
};

const UserListItem = ({ user }: UserListItemProps) => {
  return (
    <View style={{ padding: 10, backgroundColor: 'white' }}>
      <Text style={{ fontWeight: '600' }}>{user.full_name}</Text>
    </View>
  );
};

export default UserListItem;

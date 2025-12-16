import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';

import Zocial from '@expo/vector-icons/Zocial';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import * as Crypton from "expo-crypto";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Channel as ChannelType } from 'stream-chat';
import {
  AttachButton,
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
} from 'stream-chat-react-native';
export default function ChannelScreen() {
  //* fetch and store complete channel id
  const [channel, setChannel] = useState<ChannelType | null>();
  const { cid } = useLocalSearchParams<{ cid: string }>();

  const { client } = useChatContext();
  const videoClient = useStreamVideoClient();
  const { bottom } = useSafeAreaInsets();

  const joinCall = async () => {
    // console.log(JSON.stringify(Object.values(channel?.state.members), null, 2));
    const members = Object.values(channel.state.members).map((member) => ({ user_id: member.user_id}))
    // console.log(members)
    
    const call = videoClient.call('default', Crypton.randomUUID().toLowerCase());
    await call.getOrCreate({
      ring: true,
      data: {
        members,
      },
    });
    // router.push(`/call/${call.id}`);
  };
  useEffect(() => {
    const fetchChannel = async () => {
      const channels = await client.queryChannels({ cid });
      setChannel(channels[0]);
    };

    fetchChannel();
  }, [cid]);

  //* if no channel found, show loading icon
  if (!channel) {
    return <ActivityIndicator />;
  }

  return (
    <Channel channel={channel} AttachButton={AttachButton}>
      {/* Tranh keyboard che chat va input IOS
      Android duoc set o trong app.json phan softwareKeyboardLayoutMode */}
      <Stack.Screen options={{ title: "chat",headerRight: () => <Zocial name="call" size={24} color="black" onPress={joinCall} />}} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <MessageList />
        <View style={{ paddingBottom: bottom }}>
          <MessageInput />
        </View>
      </KeyboardAvoidingView>
    </Channel>
  );
}

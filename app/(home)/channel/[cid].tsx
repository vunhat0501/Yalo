import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
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
      <MessageList />
      <MessageInput />
    </Channel>
  );
}

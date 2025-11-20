import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
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

  const { bottom } = useSafeAreaInsets();

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

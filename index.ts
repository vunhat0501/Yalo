import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import "expo-router/entry";
import { StreamChat } from "stream-chat";
import { supabase } from "./lib/supabase";
import { tokenProvider } from "./utils/tokenProvider";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Remote message: ", JSON.stringify(remoteMessage, null, 2));

  const { data } = await supabase.auth.getSession();

  const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_API_KEY!);

  client._setToken(
    {
      id: data.session.user.id,
    },
    tokenProvider,
  );

  const message = await client.getMessage(remoteMessage.data.id);
  console.log(message);

  const channelId = await notifee.createChannel({
    id: "chat-messages",
    name: "Chat Messages",
  });

  const { stream, ...rest } = remoteMessage.data ?? {};

  const data = {
    ...rest,
    ...(stream ? (stream as unknown as Record<string, string>) : {}),
  };

  await notifee.displayNotification({
    title: `New message from ${message.message.user.name}`,
    body: message.message.text,
    data,
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
    },
  });
});

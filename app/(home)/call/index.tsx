import {
    CallContent,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
} from "@stream-io/video-react-native-sdk";

const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const userId = 'f4d1d685-a37f-442b-b8e9-5f37c67e5ebb';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjRkMWQ2ODUtYTM3Zi00NDJiLWI4ZTktNWYzN2M2N2U1ZWJiIn0.4ZWpiMSQJkPD3kDPN-IqC0CAYtf0iXnGkg7MMFPB0Go';
const callId = 'my-call-id';
const user: User = { id: userId };

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);
call.join({ create: true });

export default function callScreen() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallContent/>
      </StreamCall>
    </StreamVideo>
  );
}

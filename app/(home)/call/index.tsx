import {
    CallContent,
    StreamCall,
    useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";

const callId = 'my-call-id';
export default function callScreen() {
  const client = useStreamVideoClient();
  const call = client.call('default', callId);
  call.join({ create: true });
  return (
      <StreamCall call={call}>
        <CallContent/>
      </StreamCall>
  );
}

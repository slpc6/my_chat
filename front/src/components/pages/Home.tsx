import { useState } from 'react';
import JoinScreen from './JoinScreen';
import VideoCallPage from './VideoCallPage';

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);

  if (!userName) {
    return <JoinScreen onJoin={setUserName} />;
  }

  return <VideoCallPage userName={userName} onLeave={() => setUserName(null)} />;
}


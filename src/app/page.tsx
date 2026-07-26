'use client';
import { useState } from 'react';
import Chat from '../components/Chat';
import Overview from '../components/Overview';

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <main className="page">
      <Overview />
      <Chat open={chatOpen} onOpen={() => setChatOpen(true)} onClose={() => setChatOpen(false)} />
    </main>
  );
};

export default App;

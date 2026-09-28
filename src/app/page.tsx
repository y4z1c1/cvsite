'use client';
import { useState } from 'react';
import Chat from '../components/Chat';
import Stages from '../components/Stages';
import StageNav from '../components/StageNav';
import SiteControls from '../components/SiteControls';
import { StageProvider } from '../context/StageContext';
import { useScrollVelocity } from '../hooks/useScrollVelocity';
import { AuroraBackground } from '../components/ui/aurora-background';

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);
  useScrollVelocity();

  return (
    <main className="page">
      <AuroraBackground className="z-[-2]" />
      <div className="grain" aria-hidden />
      <StageProvider>
        <Stages />
        <StageNav />
        {/* inside the provider: the chat face reads whether the hero avatar is in view */}
        <Chat open={chatOpen} onOpen={() => setChatOpen(true)} onClose={() => setChatOpen(false)} />
      </StageProvider>
      <SiteControls />
    </main>
  );
};

export default App;

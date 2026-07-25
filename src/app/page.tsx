'use client';
import Chat from '../components/Chat';

const App = () => {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vh, 3rem) 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '44rem' }}>
        <Chat />
      </div>
    </main>
  );
};

export default App;

import { useState } from 'react';
import Lobby from './components/Lobby';
import WaitingRoom from './components/WaitingRoom';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState<string>('');

  const handleJoinGame = (address: string) => {
    setWalletAddress(address);
  };

  const handleGameStart = () => {
    // TODO: Implement game start logic
    console.log('Game starting!');
  };

  return (
    <div className="app">
      {!walletAddress ? (
        <Lobby onJoinGame={handleJoinGame} />
      ) : (
        <WaitingRoom 
          walletAddress={walletAddress}
          onGameStart={handleGameStart}
        />
      )}
    </div>
  );
}

export default App;

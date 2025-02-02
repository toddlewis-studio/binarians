import { useState, useEffect } from 'react';
import Lobby from './components/Lobby';
import Game from './components/Game';
import WaitingRoom from './components/WaitingRoom';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isTestPlay, setIsTestPlay] = useState<boolean>(false);

  useEffect(() => {
    // Update document title based on current page
    if (!walletAddress) {
      document.title = 'Binarians | Lobby';
    } else if (gameStarted) {
      document.title = 'Binarians | Game';
    } else {
      document.title = 'Binarians | Waiting Room';
    }
  }, [walletAddress, gameStarted]);

  const handleJoinGame = (address: string) => {
    setWalletAddress(address);
    // If it's a test address, set test mode and start game immediately
    if (address === 'TEST_WALLET_ADDRESS') {
      setIsTestPlay(true);
      setGameStarted(true);
    }
  };

  const handleGameStart = () => {
    setGameStarted(true);
  };

  const handleGameExit = () => {
    setWalletAddress('');
    setGameStarted(false);
    setIsTestPlay(false);
  };

  return (
    <div className="app">
      {!walletAddress ? (
        <Lobby onJoinGame={handleJoinGame} />
      ) : gameStarted ? (
        <Game walletAddress={walletAddress} onExit={handleGameExit} />
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

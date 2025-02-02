import { useState, useEffect } from 'react';
import './Lobby.css';

interface LobbyProps {
  onJoinGame: (walletAddress: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onJoinGame }) => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [playerCount, setPlayerCount] = useState<number>(0);

  useEffect(() => {
    // Simulate players joining (for demo purposes)
    const interval = setInterval(() => {
      setPlayerCount(prev => Math.min(prev + Math.floor(Math.random() * 3), 100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const ENTRY_FEE = 0.005; // SOL

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (!window.solana || !window.solana.isPhantom) {
        alert('Please install Phantom wallet!');
        return;
      }

      const response = await window.solana.connect();
      setWalletAddress(response.publicKey.toString());
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePlayNow = () => {
    if (!walletAddress) {
      alert('Please connect your wallet first!');
      return;
    }
    onJoinGame(walletAddress);
  };

  return (
    <div className="lobby-container">
      <div className="lobby-content">
        <h1 className="lobby-title">Welcome to Binarians</h1>
        
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Entry Fee</span>
            <span className="stat-value">{ENTRY_FEE} SOL</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Players Waiting</span>
            <span className="stat-value">{playerCount}/100</span>
          </div>
        </div>

        {!walletAddress ? (
          <button 
            className={`connect-wallet-btn ${isConnecting ? 'connecting' : ''}`}
            onClick={connectWallet}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="wallet-info">
            <span className="wallet-label">Connected:</span>
            <span className="wallet-address">
              {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
            </span>
          </div>
        )}

        <button 
          className="play-now-btn"
          onClick={handlePlayNow}
          disabled={!walletAddress}
        >
          Play Now
        </button>

        {process.env.NODE_ENV === 'development' && (
          <button 
            className="play-now-btn"
            onClick={() => onJoinGame('TEST_WALLET_ADDRESS')}
            style={{ background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)' }}
          >
            Test Play
          </button>
        )}
      </div>
    </div>
  );
};

export default Lobby;
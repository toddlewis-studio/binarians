import { useState, useEffect } from 'react';
import './Game.css';

interface GameProps {
  walletAddress: string;
  onExit: () => void;
}

interface PlayerStats {
  health: number;
  armor: number;
  items: string[];
}

const Game: React.FC<GameProps> = ({ walletAddress, onExit }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({    health: 54,
    armor: 0,
    items: []
  });
  const [turnTimer, setTurnTimer] = useState<number>(18);
  const [currentNode, setCurrentNode] = useState<string>('Start');
  const [connectedPlayers, setConnectedPlayers] = useState<number>(1);
  const [testPlayerConnected, setTestPlayerConnected] = useState<boolean>(false);
  const [testPlayerStats] = useState<PlayerStats>({
    health: 35,
    armor: 45,
    items: []
  });

  useEffect(() => {
    setConnectedPlayers(testPlayerConnected ? 2 : 1);
  }, [testPlayerConnected]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTurnTimer((prev) => (prev > 0 ? prev - 1 : 18));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddItem = (item: string) => {
    if (playerStats.items.length < 3) {
      setPlayerStats(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="player-info">
          <span className="wallet-address">
            {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
          </span>
        </div>
        <div className="turn-timer">
          Turn: {turnTimer}s
        </div>
      </div>

      <div className="game-content">
        <div className="stats-panel">
          <div className="stat-item">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="stat-label">Health</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill health"
                    style={{ width: `${(playerStats.health / 54) * 100}%` }}
                  />
                </div>
                <span className="stat-value">{playerStats.health}/54</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="stat-label">Armor</span>
                <div className="stat-bar">
                  <div 
                    className="stat-fill armor"
                    style={{ width: `${(playerStats.armor / 100) * 100}%` }}
                  />
                </div>
                <span className="stat-value">{playerStats.armor}</span>
              </div>

            </div>
          </div>

          <div className="game-info">
            <div className="current-node">
              <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Connected: {connectedPlayers}</span>
            </div>
            {testPlayerConnected && (
              <div className="test-player-card" style={{ marginTop: '10px', padding: '8px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ minWidth: '90px' }}>Enemy</span>
                  <div style={{ display: 'flex', flexGrow: 1, gap: '10px' }}>
                    <div className="stat-bar" style={{ flexGrow: 1 }}>
                      <div 
                        className="stat-fill health"
                        style={{ width: `${(testPlayerStats.health / 54) * 100}%` }}
                      />
                    </div>
                    <div className="stat-bar" style={{ flexGrow: 1 }}>
                      <div 
                        className="stat-fill armor"
                        style={{ width: `${(testPlayerStats.armor / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="items-list" style={{ marginTop: '10px' }}>
              {[0, 1, 2].map((slot) => (
                <div key={slot} className={`item ${!playerStats.items[slot] ? 'empty' : ''}`}>
                  {playerStats.items[slot] || 'Empty'}
                </div>
              ))}
            </div>
            <div className="game-actions" style={{ marginTop: '10px' }}>
              <button className="action-button search">
                Search
              </button>
              <button className="action-button explore">
                Explore
              </button>
              <button className="action-button attack" disabled={connectedPlayers < 2}>
                Attack
              </button>
            </div>
            <div className="testing-card" style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={testPlayerConnected}
                  onChange={(e) => setTestPlayerConnected(e.target.checked)}
                  style={{ margin: 0 }}
                />
                <span>Simulate Enemy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
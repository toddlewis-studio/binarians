import { useState, useEffect } from 'react';
import './Game.css';
import PlayerCard from './PlayerCard';

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
  const [isAttackMode, setIsAttackMode] = useState<boolean>(false);
  const [selectedEnemy, setSelectedEnemy] = useState<string>('');
  const [enemyWalletAddress] = useState<string>('DwZJ7XFqPJuFzR9VuQ8eKxGv7nxhzWfPpU5VLs9UPHv2');
  const [testPlayerStats] = useState<PlayerStats>({health: 35, armor: 45, items: []});
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [currentTurnLog, setCurrentTurnLog] = useState<string>('');
  const [previousTurnLog, setPreviousTurnLog] = useState<string>('');

  useEffect(() => {
    setConnectedPlayers(testPlayerConnected ? 2 : 1);
  }, [testPlayerConnected]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          setSelectedAction('');
          setIsAttackMode(false);
          setSelectedEnemy('');
          setPreviousTurnLog(currentTurnLog);
          setCurrentTurnLog('Doing nothing...');
          return 18;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTurnLog]);

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    setIsAttackMode(false);
    setSelectedEnemy('');
    setCurrentTurnLog(action === 'search' ? 'Searching' : 'Exploring');
  };

  const handleEnemySelect = (enemyId: string) => {
    if (isAttackMode) {
      setSelectedEnemy(enemyId);
      setIsAttackMode(false);
      setCurrentTurnLog(`Attacking ${enemyId.slice(0, 4)}...${enemyId.slice(-4)}`);
    }
  };

  const handleAddItem = (item: string) => {
    if (playerStats.items.length < 3) {
      setPlayerStats(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));
      setCurrentTurnLog(`Added item: ${item}`);
    }
  };

  const handleAttackClick = () => {
    setIsAttackMode(true);
    setSelectedAction('');
    setCurrentTurnLog('Picking a target');
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

          <div className="turn-logs" style={{ marginTop: '20px' }}>
            <div className="turn-log-card" style={{ 
              padding: '15px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              minHeight: '100px',
              fontSize: '0.9em',
              color: '#e0e0e0'
            }}>
              <div style={{ marginBottom: '15px' }}>{currentTurnLog}</div>
              <div style={{
                width: '100%',
                height: '2px',
                background: 'linear-gradient(to right, transparent, rgba(79, 209, 197, 0.5), transparent)',
                margin: '15px 0'
              }} />
              <div>{previousTurnLog}</div>
            </div>
          </div>

          <div className="game-info">
            <div className="current-node">
              <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Connected: {connectedPlayers}</span>
            </div>
            {testPlayerConnected && (
              <PlayerCard
                walletAddress={enemyWalletAddress}
                playerStats={testPlayerStats}
                isAttackMode={isAttackMode}
                selectedEnemy={selectedEnemy}
                enemyId="test-enemy"
                onEnemySelect={isAttackMode ? handleEnemySelect : undefined}
              />
            )}
            <div className="items-list" style={{ marginTop: '10px' }}>
              {[0, 1, 2].map((slot) => (
                <div key={slot} className={`item ${!playerStats.items[slot] ? 'empty' : ''}`}>
                  {playerStats.items[slot] || 'Empty'}
                </div>
              ))}
            </div>
            <div className="game-actions" style={{ marginTop: '10px' }}>
              <button 
                className={`action-button search ${selectedAction === 'search' ? 'active' : ''}`}
                onClick={() => handleActionSelect('search')}
                style={{
                  border: selectedAction === 'search' ? '6px solid #4fd1c5' : 'none'
                }}
              >
                Search
              </button>
              <button 
                className={`action-button explore ${selectedAction === 'explore' ? 'active' : ''}`}
                onClick={() => handleActionSelect('explore')}
                style={{
                  border: selectedAction === 'explore' ? '6px solid #4fd1c5' : 'none'
                }}
              >
                Explore
              </button>
              <button 
                className={`action-button attack ${isAttackMode ? 'active' : ''}`}
                onClick={() => {
                  if (isAttackMode) {
                    setIsAttackMode(false);
                    setSelectedAction('');
                    setSelectedEnemy('');
                    setCurrentTurnLog('Doing nothing...');
                  } else if (selectedEnemy) {
                    setSelectedEnemy('');
                    setIsAttackMode(true);
                    setCurrentTurnLog('Picking a target');
                  } else {
                    handleAttackClick();
                    setSelectedAction('');
                  }
                }}
                disabled={connectedPlayers < 2}
                style={{
                  border: !isAttackMode && selectedEnemy ? '6px solid #4fd1c5' : 'none'
                }}
              >
                {isAttackMode ? 'Cancel' : selectedEnemy ? 'Switch' : 'Attack'}
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
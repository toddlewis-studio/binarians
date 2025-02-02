import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';
import PlayerCard from './PlayerCard';
import SelectableTarget from './SelectableTarget';

interface GameProps {
  walletAddress: string;
  onExit: () => void;
}

interface ItemStats {
  name: string;
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  type: 'Weapon' | 'Armor' | 'Other';
  damage?: number;
  effects?: string[];
  armorGen?: number;
  maxArmorBoost?: number;
  maxUses: number;
  currentUses: number;
}

interface PlayerStats {
  health: number;
  armor: number;
  items: ItemStats[];
}

const Game: React.FC<GameProps> = ({ walletAddress, onExit }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    health: 54,
    armor: 0,
    items: []
  });
  const [turnTimer, setTurnTimer] = useState<number>(18);
  const [currentNode, setCurrentNode] = useState<string>(Math.floor(Math.random() * 100 + 1).toString());
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

  const getItemDescription = (item: ItemStats): string => {
    let description = `[${item.rarity}]\n${item.description}`;
    return description;
  };

  const getRandomItem = (): ItemStats => {
    const items: ItemStats[] = [
      {
        name: 'Dual Daggers',
        description: '2d4',
        rarity: 'Common',
        type: 'Weapon',
        damage: 8,
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Spiked Club',
        description: '1d4 & enemy is slowed when hit',
        rarity: 'Common',
        type: 'Weapon',
        damage: 4,
        effects: ['Slow'],
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Samurai Sword',
        description: '1d8',
        rarity: 'Common',
        type: 'Weapon',
        damage: 8,
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Flamethrower',
        description: '3d4',
        rarity: 'Rare',
        type: 'Weapon',
        damage: 12,
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Crossbow',
        description: '1d12',
        rarity: 'Rare',
        type: 'Weapon',
        damage: 12,
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Lasersword',
        description: '3d8',
        rarity: 'Epic',
        type: 'Weapon',
        damage: 24,
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Gauntlets',
        description: '2 armor generation',
        rarity: 'Common',
        type: 'Armor',
        armorGen: 2,
        maxArmorBoost: 4,
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Shield',
        description: '1 armor generation',
        rarity: 'Rare',
        type: 'Armor',
        armorGen: 1,
        maxArmorBoost: 8,
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Antivirus',
        description: '3 armor generation',
        rarity: 'Epic',
        type: 'Armor',
        armorGen: 3,
        maxArmorBoost: 6,
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Shrooms',
        description: 'Switch nodes. No portal. Death if no other node.',
        rarity: 'Rare',
        type: 'Other',
        maxUses: 1,
        currentUses: 1
      }
    ];
    return { ...items[Math.floor(Math.random() * items.length)] };
  };

  const handleAddItem = useCallback((item: ItemStats) => {
    if (playerStats.items.length < 3) {
      setPlayerStats(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));
      setCurrentTurnLog(`Added item: ${item.name}`);
    }
  }, [playerStats.items.length]);

  const handleTurnEnd = useCallback(() => {
    const wasSearching = selectedAction === 'search';
    const pastTenseLog = currentTurnLog
      .replace('Exploring', 'Explored')
      .replace('Picking a target', 'Did nothing')
      .replace('Selecting target', 'Did nothing')
      .replace('Attacking', 'Attacked')
      .replace('Doing nothing', 'Did nothing');
    setPreviousTurnLog(pastTenseLog);
    setSelectedAction('');
    setIsAttackMode(false);
    setSelectedEnemy('');
    setSelectedWeapon(null);
    setCurrentTurnLog('Doing nothing...');
    setTurnTimer(18);
  
    if (wasSearching) {
      const roll = Math.floor(Math.random() * 12) + 1;
      if (roll <= 4) {
        const foundItem = getRandomItem();
        handleAddItem(foundItem);
        setPreviousTurnLog(`You rolled ${roll} and found ${foundItem.name}!`);
      } else {
        setPreviousTurnLog(`You rolled ${roll} and found nothing.`);
      }
    }
  }, [selectedAction, currentTurnLog, handleAddItem, getRandomItem]);



  useEffect(() => {
    const timer = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          handleTurnEnd();
          return 18;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [handleTurnEnd]);

  const handleActionSelect = (action: string) => {
      setSelectedAction(action);
      setIsAttackMode(false);
      setSelectedEnemy('');
      setSelectedWeapon(null);
      setCurrentTurnLog(action === 'search' ? 'Searching' : 'Exploring');
    };
  
    const handleEnemySelect = (enemyId: string) => {
      if (isAttackMode) {
        setSelectedEnemy(enemyId);
        setIsAttackMode(false);
        setCurrentTurnLog(
          selectedWeapon
            ? `Attacking ${enemyId.slice(0, 4)}...${enemyId.slice(-4)} with ${selectedWeapon.name}`
            : `Attacking ${enemyId.slice(0, 4)}...${enemyId.slice(-4)} with Fists`
        );
      }
    };
  
    const handleAttackClick = () => {
      setIsAttackMode(true);
      setSelectedAction('');
      setSelectedWeapon(null);
      setCurrentTurnLog('Picking a target');
    };
  
    const [selectedWeapon, setSelectedWeapon] = useState<ItemStats | null>(null);
    const handleItemClick = (item: ItemStats) => {
      if (item.type === 'Weapon' && item.currentUses > 0) {
        if (selectedWeapon === item) {
          setSelectedWeapon(null);
          setIsAttackMode(false);
          setCurrentTurnLog('Doing nothing...');
        } else {
          setSelectedWeapon(item);
          setIsAttackMode(true);
          setSelectedAction('');
          setCurrentTurnLog(`Selecting target for ${item.name}`);
        }
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
  
            <div className="turn-logs" style={{ marginTop: '20px' }}>
              <div className="turn-log-card" style={{ 
                padding: '15px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                minHeight: '100px',
                fontSize: '0.9em',
                color: '#4fd1c5'
              }}>
                <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#4fd1c5' }}>{currentTurnLog}</div>
                <div style={{
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(to right, transparent, rgba(79, 209, 197, 0.5), transparent)',
                  margin: '15px 0'
                }} />
                <div style={{ color: '#ffffff' }}>{previousTurnLog}</div>
              </div>
            </div>
  
            <div className="game-info">
              <div className="current-node">
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Node {currentNode} Connected {connectedPlayers}</span>
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
                  <div key={slot} className="item-container">
                    {playerStats.items[slot] ? (
                      <SelectableTarget
                        label={playerStats.items[slot].name}
                        isDisabled={playerStats.items[slot].type !== 'Weapon' || playerStats.items[slot].currentUses <= 0}
                        onSelect={() => {
                          setSelectedWeapon(playerStats.items[slot]);
                          setCurrentTurnLog(`Selecting target for ${playerStats.items[slot].name}`);
                          setIsAttackMode(true);
                          setSelectedAction('');
                        }}
                        onDeselect={() => {
                          setSelectedWeapon(null);
                          setIsAttackMode(false);
                          setCurrentTurnLog('Doing nothing...');
                        }}
                        showUses={true}
                        uses={playerStats.items[slot].currentUses}
                        isSelected={selectedWeapon === playerStats.items[slot]}
                      />
                    ) : (
                      <div className="empty-item">Empty</div>
                    )}
                    {playerStats.items[slot] && (
                      <div className="item-tooltip">
                        {getItemDescription(playerStats.items[slot])}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="game-actions" style={{ marginTop: '10px' }}>
                <SelectableTarget
                  label="Search"
                  onSelect={() => handleActionSelect('search')}
                  onDeselect={() => handleActionSelect('')}
                  isSelected={selectedAction === 'search'}
                />
                <SelectableTarget
                  label="Explore"
                  onSelect={() => handleActionSelect('explore')}
                  onDeselect={() => handleActionSelect('')}
                  isSelected={selectedAction === 'explore'}
                />
                <SelectableTarget
                  label="Attack"
                  isDisabled={connectedPlayers < 2}
                  onSelect={() => {
                    setIsAttackMode(true);
                    setSelectedAction('');
                    setSelectedWeapon(null);
                    setCurrentTurnLog('Picking a target');
                  }}
                  onDeselect={() => {
                    setIsAttackMode(false);
                    setSelectedAction('');
                    setSelectedEnemy('');
                    setCurrentTurnLog('Doing nothing...');
                  }}
                  isSelected={isAttackMode && !selectedWeapon}
                />
              </div>
              <div className="testing-card" style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="checkbox"
                    checked={testPlayerConnected}
                    onChange={(e) => setTestPlayerConnected(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  <span>Simulate Enemy</span>
                </div>
                <button
                  onClick={handleTurnEnd}
                  style={{
                    backgroundColor: '#4a5568',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  End Turn (Dev Only)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Game;
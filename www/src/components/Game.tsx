import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';
import SelectableTarget from './SelectableTarget';
import EnemyList from './EnemyList';
import * as GameTypes from '../types/game.ts';

const Game: React.FC<GameTypes.GameProps> = ({ walletAddress, onExit }) => {
  const [testPlayerConnected, setTestPlayerConnected] = useState<boolean>(false);
  const [playerStats, setPlayerStats] = useState<GameTypes.PlayerStats>({
    health: 36,
    armor: 0,
    items: []
  });
  const [turnTimer, setTurnTimer] = useState<number>(18);
  const [currentNode, setCurrentNode] = useState<string>(Math.floor(Math.random() * 100 + 1).toString());
  const [remainingNodes, setRemainingNodes] = useState<number>(100);
  const [connectedPlayers, setConnectedPlayers] = useState<number>(100);
  const [simulateMultipleEnemies, setSimulateMultipleEnemies] = useState<boolean>(false);
  const [isAttackMode, setIsAttackMode] = useState<boolean>(false);
  const [selectedEnemy, setSelectedEnemy] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [currentTurnLog, setCurrentTurnLog] = useState<string>('');
  const [previousTurnLog, setPreviousTurnLog] = useState<string>('');
  const [turnNumber, setTurnNumber] = useState<number>(1);

  const getItemDescription = (item: GameTypes.ItemStats): string => {
    let description = `[${item.rarity}]\n${item.description}`;
    return description;
  };

  const getRandomItem = (): GameTypes.ItemStats => {
    const items: GameTypes.ItemStats[] = [
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
  
  const [selectedWeapon, setSelectedWeapon] = useState<GameTypes.ItemStats | null>(null);

  const handleAddItem = useCallback((item: GameTypes.ItemStats) => {
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
    const wasExploring = selectedAction === 'explore';
    const wasAttacking = currentTurnLog.includes('Attacking');

    let pastTenseLog = currentTurnLog
      .replace('Attacking', 'Attacked')
      .replace('Exploring', 'Explored')
      .replace('Picking a target', 'Did nothing')
      .replace('Selecting target', 'Did nothing')
      .replace('Doing nothing', 'Did nothing');

    if (wasAttacking) {
      const baseDamage = selectedWeapon?.damage || 4; // 1d4 for fists
      const diceCount = Math.floor(baseDamage / 4) || 1;
      const diceSize = baseDamage / diceCount;
      let totalDamage = 0;

      for (let i = 0; i < diceCount; i++) {
        totalDamage += Math.floor(Math.random() * diceSize) + 1;
      }

      pastTenseLog = `${currentTurnLog} for ${totalDamage} dmg! (${diceCount}d${diceSize})`;
    }

    setPreviousTurnLog(pastTenseLog);
    setSelectedAction('');
    setIsAttackMode(false);
    setSelectedEnemy('');
    setSelectedWeapon(null);
    setCurrentTurnLog('Doing nothing...');
    setTurnTimer(18);
    setTurnNumber(prev => prev + 1);

    // Update remaining nodes and players
    setRemainingNodes(prev => Math.max(1, prev - 1));
    const playerReduction = Math.floor(Math.random() * 4); // 0-3 players
    setConnectedPlayers(prev => Math.max(1, prev - playerReduction));
  
    if (wasSearching) {
      const roll = Math.floor(Math.random() * 12) + 1;
      if (roll <= 4) {
        const foundItem = getRandomItem();
        handleAddItem(foundItem);
        setPreviousTurnLog(`You rolled ${roll} and found ${foundItem.name}!`);
      } else {
        setPreviousTurnLog(`You rolled ${roll} and found nothing.`);
      }
    } else if (wasExploring) {
      const roll = Math.floor(Math.random() * 12) + 1;
      if (roll <= 8) {
        const newNode = Math.floor(Math.random() * 100 + 1).toString();
        setCurrentNode(newNode);
        setPreviousTurnLog(`You rolled ${roll} and moved to Node ${newNode}!`);
      } else if (roll <= 11) {
        setPreviousTurnLog(`You rolled ${roll} and found no path forward.`);
      } else {
        const foundItem = getRandomItem();
        handleAddItem(foundItem);
        setPreviousTurnLog(`You rolled ${roll} and discovered ${foundItem.name}!`);
      }
    }
  }, [selectedAction, currentTurnLog, handleAddItem, getRandomItem, selectedWeapon]);



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
  
    const handleItemClick = (item: GameTypes.ItemStats) => {
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
        <div className="game-header" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          padding: '15px',
          borderRadius: '4px',
          animation: turnTimer <= 6 ? 'pulsate 1s infinite ease-in-out' : 'none',
          '--pulse-opacity': `${0.2 + (1 - Math.min(turnTimer, 6)/6) * 0.3}`
        }}>
          <div className="player-info">
            <span className="wallet-address">
              {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
            </span>
          </div>
          <div className="turn-timer">
            Turn {turnNumber}: {turnTimer}s
          </div>
        </div>
  
        <div className="game-content">
          <div className="stats-panel">
            <div className="stat-item">
              <div className="stats-container">
                <div className="stat-row">
                  <span className="stat-label">Health</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill health"
                      style={{ width: `${(playerStats.health / 36) * 100}%` }}
                    />
                  </div>
                  <span className="stat-value">{playerStats.health}/36</span>
                </div>
                <div className="stat-row">
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
  
            <div className="turn-logs">
              <div className="turn-log-card">
                <div className="turn-log-current">{currentTurnLog}</div>
                <div className="turn-log-divider" />
                <div className="turn-log-previous">{previousTurnLog}</div>
              </div>
            </div>
  
            <div className="game-info">
              <div className="current-node">
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Node {currentNode} ({Math.max(1, testPlayerConnected ? 2 : 1)})</span>
                <div className="current-node-stats">
                  {remainingNodes} nodes & {connectedPlayers} players remaining
                </div>
              </div>
              <EnemyList
                isAttackMode={isAttackMode}
                selectedEnemy={selectedEnemy}
                onEnemySelect={handleEnemySelect}
                simulateMultipleEnemies={simulateMultipleEnemies}
              />
              <div className="items-list">
                {[0, 1, 2].map((slot) => (
                  <div key={slot} className="item-container">
                    {playerStats.items[slot] ? (
                      <SelectableTarget
                        label={playerStats.items[slot].name}
                        isDisabled={playerStats.items[slot].type !== 'Weapon' || playerStats.items[slot].currentUses <= 0}
                        data-tooltip={getItemDescription(playerStats.items[slot])}
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
              <div className="game-actions">
                <SelectableTarget
                  label="Search"
                  onSelect={() => handleActionSelect('search')}
                  onDeselect={() => handleActionSelect('')}
                  isSelected={selectedAction === 'search'}
                  data-tooltip="Roll 12 sided dice\n\n1-4 Find item\n5-12 Find nothing"
                />
                <SelectableTarget
                  label="Explore"
                  onSelect={() => handleActionSelect('explore')}
                  onDeselect={() => handleActionSelect('')}
                  isSelected={selectedAction === 'explore'}
                  data-tooltip="Roll 12 sided dice\n\n1-8 Leave node\n9-11 Find nothing\n12 Find item"
                />
                <SelectableTarget
                  label="Attack"
                  isDisabled={connectedPlayers < 2}
                  data-tooltip="Basic Attack: 1d4 damage"
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
              <div className="testing-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="checkbox"
                    checked={simulateMultipleEnemies}
                    onChange={(e) => setSimulateMultipleEnemies(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  <span>Simulate Multiple Enemies</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexDirection: 'column' }}>
                  <button
                    onClick={() => {
                      const lasersword = {
                        name: 'Lasersword',
                        description: '3d8',
                        rarity: 'Epic',
                        type: 'Weapon',
                        damage: 24,
                        maxUses: 3,
                        currentUses: 3
                      };
                      setPlayerStats(prev => ({
                        ...prev,
                        items: [lasersword, ...prev.items.slice(0, 2)]
                      }));
                    }}
                    className="end-turn-button"
                    style={{ flex: 1 }}
                  >
                    Add Lasersword
                  </button>
                  <button
                    onClick={handleTurnEnd}
                    className="end-turn-button"
                    style={{ flex: 1 }}
                  >
                    End Turn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
export default Game;
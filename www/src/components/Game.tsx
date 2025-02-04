import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';
import SelectableTarget from './SelectableTarget';
import EnemyList from './EnemyList';
import * as GameTypes from '../types/game.ts';

const Game: React.FC<GameTypes.GameProps> = ({ walletAddress, onExit }) => {
  const [testPlayerConnected, setTestPlayerConnected] = useState<boolean>(false);
  const [playerStats, setPlayerStats] = useState<GameTypes.PlayerStats>({
    health: 18,
    armor: 3,
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
  const [isEndingTurn, setIsEndingTurn] = useState<boolean>(false);
  const [enemies, setEnemies] = useState<GameTypes.EnemyStats[]>([]);
  
  useEffect(() => {
    if (simulateMultipleEnemies) {
      const count = Math.floor(Math.random() * 3) + 2;
      const newEnemies = Array.from({ length: count }, () => ({
        walletAddress: generateRandomWallet(),
        stats: generateEnemyStats()
      }));
      setEnemies(newEnemies);
    } else {
      setEnemies([]);
    }
  }, [simulateMultipleEnemies]);

  const generateRandomWallet = () => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let wallet = '';
    for (let i = 0; i < 44; i++) {
      wallet += chars[Math.floor(Math.random() * chars.length)];
    }
    return wallet;
  };

  const generateEnemyStats = (): GameTypes.PlayerStats => ({
    health: Math.floor(Math.random() * 9) + 9, // Random health between 9-18
    armor: Math.floor(Math.random() * 9), // Random armor between 0-9
    items: []
  });

  const getItemDescription = (item: GameTypes.ItemStats): string => {
    let description = `[${item.rarity}]\n${item.description}`;
    return description;
  };

  const getItems = () => {
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
        description: '2d4',
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
        description: '3d4',
        rarity: 'Rare',
        type: 'Weapon',
        damage: 12,
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Lasersword',
        description: '4d4',
        rarity: 'Epic',
        type: 'Weapon',
        damage: 16,
        maxUses: 3,
        currentUses: 3
      },
      {
        name: 'Gauntlets',
        description: '2 armor generation',
        rarity: 'Common',
        type: 'Armor',
        armorGen: 2,
        maxUses: 2,
        currentUses: 2
      },
      {
        name: 'Shield',
        description: '1 armor generation',
        rarity: 'Rare',
        type: 'Armor',
        armorGen: 1,
        maxUses: 6,
        currentUses: 6
      },
      {
        name: 'Antivirus',
        description: '3 armor generation',
        rarity: 'Epic',
        type: 'Armor',
        armorGen: 3,
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
    ]
    return items
  }

  const getRandomItem = (): GameTypes.ItemStats => {
    const items = getItems();
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
    if (isEndingTurn) return;
    setIsEndingTurn(true);
    const wasSearching = selectedAction === 'search';
    const wasExploring = selectedAction === 'explore';
    const wasRunning = selectedAction === 'run';
    const wasAttacking = currentTurnLog.includes('Attacking');

    let pastTenseLog = currentTurnLog
      .replace('Attacking', 'Attacked')
      .replace('Exploring', 'Explored')
      .replace('Picking a target', 'Did nothing')
      .replace('Selecting target', 'Did nothing')
      .replace('Doing nothing', 'Did nothing');

    if (wasAttacking) {
      const baseDamage = selectedWeapon ? selectedWeapon.damage : 4; // 1d4 for fists
      const diceCount = Math.floor((baseDamage ?? 4) / 4) || 1;
      const diceSize = (baseDamage ?? 4) / diceCount;
      let totalDamage = 0;

      for (let i = 0; i < diceCount; i++) {
        totalDamage += Math.floor(Math.random() * diceSize) + 1;
      }

      if (selectedWeapon) {
        // Update weapon uses and remove if depleted
        setPlayerStats(prev => {
          const updatedItems = prev.items.map(item => 
            item === selectedWeapon 
              ? { ...item, currentUses: item.currentUses - 1 }
              : item
          ).filter(item => item.currentUses > 0);
      
          return {
            ...prev,
            items: updatedItems
          };
        });
      }
  
      // Update enemy health and remove if defeated
      const updatedEnemies = enemies.map(enemy => {
        if (enemy.walletAddress === selectedEnemy) {
          const enemyArmor = enemy.stats.armor || 0;
          const damageToArmor = Math.min(enemyArmor, totalDamage);
          const remainingDamage = totalDamage - damageToArmor;
          const newArmor = Math.max(0, enemyArmor - damageToArmor);
          const newHealth = Math.max(0, enemy.stats.health - remainingDamage);
  
          if (newHealth <= 0) {
            setConnectedPlayers(prev => Math.max(1, prev - 1));
            return null;
          }
          return {
            ...enemy,
            stats: { ...enemy.stats, health: newHealth, armor: newArmor }
          };
        }
        return enemy;
      }).filter(Boolean) as GameTypes.EnemyStats[];
  
      setEnemies(updatedEnemies);
  
      pastTenseLog = `${currentTurnLog} for ${totalDamage} dmg! (${diceCount}d${diceSize})`;
    }

    // Handle armor items
    const armorItems = playerStats.items.filter(item => item.type === 'Armor' && item.currentUses > 0);
    armorItems.forEach(item => {
      if (item.armorGen) {
        setPlayerStats(prev => {
          let newArmor = prev.armor + (item.armorGen || 0);
          if (newArmor > 18) newArmor = 18;
          const updatedItems = prev.items.map(i => 
            i === item
              ? { ...i, currentUses: i.currentUses - 1 }
              : i
          ).filter(i => i.currentUses > 0);
  
          return {
            ...prev,
            armor: newArmor,
            items: updatedItems
          };
        });
      }
    });

    setPreviousTurnLog(pastTenseLog);
    setSelectedAction('');
    setIsAttackMode(false);
    setSelectedEnemy('');
    setSelectedWeapon(null);
    setCurrentTurnLog('Doing nothing...');
    setTurnNumber(prev => prev + 1);
    setIsEndingTurn(false);
    setTurnTimer(18);

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
    } else if (wasRunning) {
      const roll = Math.floor(Math.random() * 12) + 1;
      if (roll <= 6) {
        const newNode = Math.floor(Math.random() * 100 + 1).toString();
        setCurrentNode(newNode);
        setPreviousTurnLog(`You rolled ${roll} and successfully escaped to Node ${newNode}!`);
      } else {
        const damage = Math.floor(Math.random() * 4) + 1;
        setPlayerStats(prev => ({
          ...prev,
          health: Math.max(0, prev.health - damage)
        }));
        setPreviousTurnLog(`You rolled ${roll}, failed to escape and took ${damage} damage!`);
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
        if (prev <= 1 && !isEndingTurn) {
          handleTurnEnd();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [handleTurnEnd, isEndingTurn]);

  const handleActionSelect = (action: string) => {
      setSelectedAction(action);
      setIsAttackMode(false);
      setSelectedEnemy('');
      setSelectedWeapon(null);
      setCurrentTurnLog(action === 'search' ? 'Searching' : action === 'run' ? 'Running' : 'Exploring');
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
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          padding: '15px',
          borderRadius: '4px',
          animation: turnTimer <= 6 ? 'pulsate 1s infinite ease-in-out' : 'none'
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
                      style={{ width: `${(playerStats.health / 18) * 100}%` }}
                    />
                  </div>
                  <span className="stat-value">{playerStats.health}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Armor</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill armor"
                      style={{ width: `${(playerStats.armor / 18) * 100}%` }}
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
                <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Node {currentNode} ({1 + enemies.length})</span>
                <div className="current-node-stats">
                  {remainingNodes} nodes & {connectedPlayers} players remaining
                </div>
              </div>
              <EnemyList
                isAttackMode={isAttackMode}
                selectedEnemy={selectedEnemy}
                onEnemySelect={handleEnemySelect}
                simulateMultipleEnemies={simulateMultipleEnemies}
                enemies={enemies}
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
                  data-tooltip={"Roll 12 sided dice\n\n1-4 Find item\n5-12 Find nothing"}
                />
                <SelectableTarget
                  label={simulateMultipleEnemies ? "Run" : "Explore"}
                  onSelect={() => handleActionSelect(simulateMultipleEnemies ? 'run' : 'explore')}
                  onDeselect={() => handleActionSelect('')}
                  isSelected={selectedAction === 'explore' || selectedAction === 'run'}
                  data-tooltip={simulateMultipleEnemies ? 
                    "Roll 12 sided dice\n\n1-6 Escape node\n7-12 Take 1d4 damage and stay" :
                    "Roll 12 sided dice\n\n1-8 Leave node\n9-11 Find nothing\n12 Find item"}
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
                      const lasersword = getItems().find(i => i.name === 'Lasersword');
                      setPlayerStats(prev => ({
                        ...prev,
                        items: [lasersword as GameTypes.ItemStats, ...prev.items.slice(0, 2)]
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
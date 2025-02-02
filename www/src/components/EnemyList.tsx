import React from 'react';
import PlayerCard from './PlayerCard';
import * as GameTypes from '../types/game.ts';

interface EnemyListProps {
  isAttackMode: boolean;
  selectedEnemy: string;
  onEnemySelect: (enemyId: string) => void;
  simulateMultipleEnemies: boolean;
}

const generateRandomWallet = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let wallet = '';
  for (let i = 0; i < 44; i++) {
    wallet += chars[Math.floor(Math.random() * chars.length)];
  }
  return wallet;
};

const generateEnemyStats = (): GameTypes.PlayerStats => ({
  health: Math.floor(Math.random() * 16) + 20, // Random health between 20-35
  armor: Math.floor(Math.random() * 46), // Random armor between 0-45
  items: []
});

const EnemyList: React.FC<EnemyListProps> = ({
  isAttackMode,
  selectedEnemy,
  onEnemySelect,
  simulateMultipleEnemies
}) => {
  const enemies = React.useMemo(() => {
    if (!simulateMultipleEnemies) return [];
    const count = Math.floor(Math.random() * 3) + 2;
    return Array.from({ length: count }, () => ({
      walletAddress: generateRandomWallet(),
      stats: generateEnemyStats()
    }));
  }, [simulateMultipleEnemies]);

  return (
    <div className="enemies-list">
      {enemies.map((enemy) => (
        <PlayerCard
          key={enemy.walletAddress}
          walletAddress={enemy.walletAddress}
          playerStats={enemy.stats}
          isAttackMode={isAttackMode}
          selectedEnemy={selectedEnemy}
          enemyId={enemy.walletAddress}
          onEnemySelect={isAttackMode ? onEnemySelect : undefined}
        />
      ))}
    </div>
  );
};

export default EnemyList;
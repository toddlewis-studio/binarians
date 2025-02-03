import React from 'react';
import PlayerCard from './PlayerCard';
import * as GameTypes from '../types/game.ts';

interface EnemyListProps {
  isAttackMode: boolean;
  selectedEnemy: string;
  onEnemySelect: (enemyId: string) => void;
  simulateMultipleEnemies: boolean;
  enemies: GameTypes.EnemyStats[];
}

const EnemyList: React.FC<EnemyListProps> = ({
  isAttackMode,
  selectedEnemy,
  onEnemySelect,
  simulateMultipleEnemies,
  enemies
}) => {
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
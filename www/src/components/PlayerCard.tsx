import { PlayerStats } from './Game';

interface PlayerCardProps {
  walletAddress: string;
  playerStats: PlayerStats;
  isAttackMode: boolean;
  selectedEnemy: string;
  enemyId: string;
  onEnemySelect?: (enemyId: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  walletAddress,
  playerStats,
  isAttackMode,
  selectedEnemy,
  enemyId,
  onEnemySelect
}) => {
  const isSelectable = isAttackMode && onEnemySelect;
  const isSelected = !isAttackMode && selectedEnemy === enemyId;

  const handleClick = () => {
    if (isSelectable && onEnemySelect) {
      onEnemySelect(enemyId);
    }
  };

  const CardComponent = isSelectable ? 'button' : 'div';

  return (
    <CardComponent
      className={`test-player-card ${isAttackMode ? 'attack-mode' : ''}`}
      onClick={handleClick}
      style={{
        marginTop: '10px',
        padding: '8px',
        backgroundColor: isAttackMode ? 'rgba(255, 107, 107, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        borderRadius: '4px',
        cursor: isSelectable ? 'pointer' : 'default',
        border: isSelected ? '2px solid #ff6b6b' : 'none',
        width: '100%',
        boxSizing: 'border-box',
        display: 'block',
        textAlign: 'left'
      }}
      {...(isSelectable && {
        role: 'button',
        'aria-label': 'Select enemy target'
      })}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ minWidth: '90px' }}>
          {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
        </span>
        <div style={{ display: 'flex', flexGrow: 1, gap: '10px' }}>
          <div className="stat-bar" style={{ flexGrow: 1 }}>
            <div
              className="stat-fill health"
              style={{ width: `${(playerStats.health / 54) * 100}%` }}
            />
          </div>
          <div className="stat-bar" style={{ flexGrow: 1 }}>
            <div
              className="stat-fill armor"
              style={{ width: `${(playerStats.armor / 100) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </CardComponent>
  );
};

export default PlayerCard;
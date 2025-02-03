import * as GameTypes from '../types/game.ts';

interface PlayerCardProps {
  walletAddress: string;
  playerStats: GameTypes.PlayerStats;
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
          <div className="stat-bar" style={{ flexGrow: 1, position: 'relative' }}>
            <div
              className="stat-fill health"
              style={{ width: `${(playerStats.health / 18) * 100}%` }}
            />
            <span style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              fontSize: '0.8em',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              {playerStats.health}
            </span>
          </div>
          <div className="stat-bar" style={{ flexGrow: 1, position: 'relative' }}>
            <div
              className="stat-fill armor"
              style={{ width: `${(playerStats.armor / 18) * 100}%` }}
            />
            <span style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              fontSize: '0.8em',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              {playerStats.armor}
            </span>
          </div>
        </div>
      </div>
    </CardComponent>
  );
};

export default PlayerCard;
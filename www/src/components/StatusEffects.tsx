import React from 'react';
import { Status } from '../types/game';
import './StatusEffects.css';

interface StatusEffectsProps {
  statuses: Status[];
}

const StatusEffects: React.FC<StatusEffectsProps> = ({ statuses }) => {
  const getStatusDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      // Glitches (Debuffs)
      fatigued: 'Reduced energy regeneration',
      overwhelmed: 'Decreased armor generation',
      horrified: 'Reduced damage output',
      paranoid: 'Increased damage taken',
      
      // Hacks (Buffs)
      spiritual: 'Increased health regeneration',
      adrenaline: 'Increased damage output',
      mamasCookin: 'Increased armor generation',
      payToWin: 'Reduced damage taken'
    };
    
    return descriptions[type] || 'Unknown status effect';
  };

  const isHack = (type: string): boolean => {
    return ['spiritual', 'adrenaline', 'mamasCookin', 'payToWin'].includes(type);
  };

  return (
    <div className="status-effects">
      {statuses.map((status, index) => (
        <div
          key={`${status.type}-${index}`}
          className={`status-effect ${isHack(status.type) ? 'hack' : 'glitch'}`}
        >
          <span className="status-name">{status.type}</span>
          <div className="status-tooltip">
            <p>{getStatusDescription(status.type)}</p>
            <p>Duration: {status.duration} turns</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusEffects;
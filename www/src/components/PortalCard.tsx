import * as GameTypes from '../types/game.ts';
import StatusEffects from './StatusEffects';

interface PortalCardProps {
  walletAddress: string;
  nodeNumber: number;
  onSelect: (nodeNumber: number) => void;
}

const PortalCard: React.FC<PortalCardProps> = ({
  walletAddress,
  nodeNumber,
  onSelect
}) => {

  const handleClick = () => {
    onSelect(nodeNumber);
  };

  return (
    <button
        onClick={handleClick}
    >
        <div>${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}</div>
        <div>Node {nodeNumber}</div>
    </button>
  );
};

export default PortalCard;
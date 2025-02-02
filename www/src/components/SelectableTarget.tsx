import React, { useState } from 'react';

interface SelectableTargetProps {
  label: string;
  isDisabled?: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  showUses?: boolean;
  uses?: number;
  isSelected?: boolean;
}

const SelectableTarget: React.FC<SelectableTargetProps> = ({
  label,
  isDisabled = false,
  onSelect,
  onDeselect,
  showUses = false,
  uses = 0,
  isSelected = false,
}) => {
  const [internalSelected, setInternalSelected] = useState(isSelected);

  React.useEffect(() => {
    setInternalSelected(isSelected);
  }, [isSelected]);

  const handleClick = () => {
    if (isDisabled) return;
    const newState = !internalSelected;
    setInternalSelected(newState);
    if (newState) {
      onSelect();
    } else {
      onDeselect();
    }
  };

  return (
    <button
      className={`selectable-target ${internalSelected ? 'active' : ''}`}
      onClick={handleClick}
      disabled={isDisabled}
      data-tooltip={label === 'Search' ? "Roll 12 sided dice\n\n1-4 Find item\n5-12 Find nothing" : 
               label === 'Explore' ? "Roll 12 sided dice\n\n1-8 Leave node\n9-11 Find nothing\n12 Find item" : 
               undefined}
      style={{
        background: label === 'Search' ? 'linear-gradient(45deg, #2980b9, #3498db)' :
                  label === 'Explore' ? 'linear-gradient(45deg, #27ae60, #2ecc71)' :
                  label === 'Attack' ? 'linear-gradient(45deg, #c0392b, #e74c3c)' :
                  'linear-gradient(45deg, #4fd1c5, #38b2ac)',
        color: '#fff',
        border: internalSelected ? '6px solid #4fd1c5' : 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        width: '100%',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'all 0.3s ease',
        transform: internalSelected ? 'scale(1.05)' : 'none',
        boxShadow: internalSelected ? '0 0 15px rgba(79, 209, 197, 0.5)' : 'none'
      }}
    >
      {label} {showUses && `(${uses})`}
    </button>
  );
};

export default SelectableTarget;
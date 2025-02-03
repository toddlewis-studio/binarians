export type ItemRarity = 'common' | 'rare' | 'epic';

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'other';
  rarity: ItemRarity;
  uses: number;
  maxUses: number;
  effects: {
    damage?: number;
    armorGeneration?: number;
    maxArmor?: number;
    special?: string;
  };
}

export type GlitchType = 'fatigued' | 'overwhelmed' | 'horrified' | 'paranoid';
export type HackType = 'spiritual' | 'adrenaline' | 'mamasCookin' | 'payToWin';

export interface Status {
  type: GlitchType | HackType | 'slowed';
  duration: number;
}

export interface Player {
  id: string;
  health: number;
  armor: number;
  items: Item[];
  statuses: Status[];
  currentNode: string;
}

export interface GameState {
  players: Record<string, Player>;
  nodes: string[];
  timer: number;
  phase: 'waiting' | 'playing' | 'finished';
  minPlayers: number;
  maxPlayers: number;
  waitTime: number;
  turnTime: number;
}

export interface PlayerStats {
  health: number;
  armor: number;
  items: ItemStats[];
}

export interface EnemyStats {
  walletAddress: string,
  stats: PlayerStats
}

export interface GameProps {
  walletAddress: string;
  onExit: () => void;
}

export interface ItemStats {
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
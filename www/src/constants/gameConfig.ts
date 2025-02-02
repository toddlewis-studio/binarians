import { Item } from '../types/game';

export const GAME_CONFIG = {
  BASE_HEALTH: 54,
  MIN_PLAYERS: 20,
  MAX_PLAYERS: 100,
  WAIT_TIME: 180, // 3 minutes in seconds
  TURN_TIME: 18,
  ENTRY_FEE: 0.005, // in SOL
  WINNER_PRIZE_PERCENTAGE: 0.8
};

export const WEAPONS: Item[] = [
  {
    id: 'dual-daggers',
    name: 'Dual Daggers',
    type: 'weapon',
    rarity: 'common',
    uses: 0,
    maxUses: 4,
    effects: { damage: 8 } // 2d4
  },
  {
    id: 'spiked-club',
    name: 'Spiked Club',
    type: 'weapon',
    rarity: 'common',
    uses: 0,
    maxUses: 4,
    effects: { damage: 4, special: 'slowed' } // 1d4 + slow
  },
  {
    id: 'samurai-sword',
    name: 'Samurai Sword',
    type: 'weapon',
    rarity: 'common',
    uses: 0,
    maxUses: 4,
    effects: { damage: 8 } // 1d8
  },
  {
    id: 'flamethrower',
    name: 'Flamethrower',
    type: 'weapon',
    rarity: 'rare',
    uses: 0,
    maxUses: 4,
    effects: { damage: 12 } // 3d4
  },
  {
    id: 'crossbow',
    name: 'Crossbow',
    type: 'weapon',
    rarity: 'rare',
    uses: 0,
    maxUses: 4,
    effects: { damage: 12 } // 1d12
  },
  {
    id: 'lasersword',
    name: 'Lasersword',
    type: 'weapon',
    rarity: 'epic',
    uses: 0,
    maxUses: 4,
    effects: { damage: 24 } // 3d8
  }
];

export const ARMORS: Item[] = [
  {
    id: 'gauntlets',
    name: 'Gauntlets',
    type: 'armor',
    rarity: 'common',
    uses: 0,
    maxUses: 4,
    effects: { armorGeneration: 2, maxArmor: 4 }
  },
  {
    id: 'shield',
    name: 'Shield',
    type: 'armor',
    rarity: 'rare',
    uses: 0,
    maxUses: 4,
    effects: { armorGeneration: 1, maxArmor: 8 }
  },
  {
    id: 'antivirus',
    name: 'Antivirus',
    type: 'armor',
    rarity: 'epic',
    uses: 0,
    maxUses: 4,
    effects: { armorGeneration: 3, maxArmor: 6 }
  }
];

export const OTHER_ITEMS: Item[] = [
  {
    id: 'shrooms',
    name: 'Shrooms',
    type: 'other',
    rarity: 'rare',
    uses: 0,
    maxUses: 4,
    effects: { special: 'switchNode' }
  }
];

export const ALL_ITEMS = [...WEAPONS, ...ARMORS, ...OTHER_ITEMS];
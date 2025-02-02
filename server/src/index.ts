import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import { Connection, PublicKey } from '@solana/web3.js';

dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Initialize Solana connection
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Game state management
let gameState = {
  players: {},
  nodes: [],
  timer: 0,
  phase: 'waiting',
  minPlayers: 20,
  maxPlayers: 100,
  waitTime: 180,
  turnTime: 18
};

// Routes
app.post('/join', async (req, res) => {
  const { playerId, walletAddress } = req.body;
  
  if (Object.keys(gameState.players).length >= gameState.maxPlayers) {
    return res.status(400).json({ error: 'Game is full' });
  }

  // Verify Solana wallet
  try {
    new PublicKey(walletAddress);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  gameState.players[playerId] = {
    id: playerId,
    health: 54,
    armor: 0,
    items: [],
    statuses: [],
    currentNode: gameState.nodes[0] || ''
  };

  res.json({ success: true, gameState });
});

app.post('/action', (req, res) => {
  const { playerId, action, target } = req.body;
  
  if (!gameState.players[playerId]) {
    return res.status(404).json({ error: 'Player not found' });
  }

  // Handle player actions
  // TODO: Implement action logic

  res.json({ success: true, gameState });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import { useState, useEffect } from 'react';
import './WaitingRoom.css';

interface WaitingRoomProps {
  walletAddress: string;
  onGameStart?: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ walletAddress, onGameStart }) => {
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds countdown
  const MIN_PLAYERS = 2;
  const MAX_PLAYERS = 100;

  useEffect(() => {
    // Simulate players joining (for demo purposes)
    const playerInterval = setInterval(() => {
      setPlayerCount(prev => Math.min(prev + 1, MAX_PLAYERS));
    }, 3000);

    // Countdown timer
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          if (onGameStart && playerCount >= MIN_PLAYERS) {
            onGameStart();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(playerInterval);
      clearInterval(timerInterval);
    };
  }, [playerCount, onGameStart]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="waiting-room-container">
      <div className="waiting-room-content">
        <h2 className="waiting-title">Waiting for Players</h2>
        
        <div className="player-count">
          <div className="count-display">
            <span className="current-count">{playerCount}</span>
            <span className="max-count">/{MAX_PLAYERS}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(playerCount / MAX_PLAYERS) * 100}%` }}
            />
          </div>
        </div>

        <div className="timer">
          <div className="timer-circle">
            <span className="time-left">{formatTime(timeLeft)}</span>
          </div>
          <p className="timer-label">Time until game starts</p>
        </div>

        <div className="status-message">
          {playerCount < MIN_PLAYERS ? (
            <p>Waiting for more players to join...</p>
          ) : (
            <p>Game starting soon!</p>
          )}
        </div>

        <div className="wallet-info">
          <span className="wallet-label">Connected Wallet:</span>
          <span className="wallet-address">
            {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
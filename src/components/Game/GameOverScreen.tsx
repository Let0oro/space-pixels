import React from "react";

interface GameOverScreenProps {
  onRetry: () => void;
  onMain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRetry, onMain }) => (
  <div style={{ display: "block", width: "100%", textAlign: "center" }}>
    <h3>Game Over</h3>
    <button className="button_retry" onClick={onRetry}>
      Play Again?
    </button>
    <button onClick={onMain}>Main</button>
  </div>
);

export default GameOverScreen;

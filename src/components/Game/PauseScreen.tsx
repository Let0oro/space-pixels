import React from "react";

interface PauseScreenProps {
  onResume: () => void;
  onMain: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume, onMain }) => (
  <div style={{ display: "block", width: "100%", textAlign: "center" }}>
    <h3>Pause</h3>
    <p className="advice-gamer">Remind you can use the arrow keys to move your ship</p>
    <div style={{ display: "flex", gap: ".5rem", justifyContent: "center" }}>
      <button onClick={onResume}>Resume</button>
      <button onClick={onMain}>
        Main (you could lose every point of this match)
      </button>
    </div>
  </div>
);

export default PauseScreen;

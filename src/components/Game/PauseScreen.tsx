import React from "react";

interface PauseScreenProps {
  onResume: () => void;
  onMain: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume, onMain }) => (
  <div style={{ display: "block", width: "100%", textAlign: "center" }}>
    <h3>Pause</h3>
    <button onClick={onResume}>Resume</button>
    <button onClick={onMain}>
      Main (you could lose every point of this match)
    </button>
  </div>
);

export default PauseScreen;

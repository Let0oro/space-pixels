import React from "react";

interface GameOverScreenProps {
  onRetry: () => void;
  onMain: () => void;
  points: number;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRetry, onMain, points }) => {
  const coinsEarned = points >= 20 ? Math.floor(points / 20) : 0;

  return (
    <div className="game-wrapper" style={{ justifyContent: "center", minHeight: "100vh" }}>
      <div
        style={{
          textAlign: "center",
          background: "rgba(13, 13, 26, 0.95)",
          border: "1px solid rgba(240, 82, 82, 0.4)",
          borderRadius: "12px",
          padding: "2.5rem 3rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          boxShadow: "0 0 40px rgba(240, 82, 82, 0.15)",
          minWidth: "260px",
        }}
      >
        {/* Title */}
        <div>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>💀</div>
          <h2
            style={{
              margin: 0,
              color: "var(--color-error, #f05252)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontSize: "1.6rem",
            }}
          >
            GAME OVER
          </h2>
        </div>

        {/* Score + coins */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "8px",
            padding: "0.85rem 1.2rem",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--color-text-muted, #8b949e)", fontSize: "0.8rem" }}>Points</span>
            <span style={{ color: "var(--color-text, #e5e7eb)", fontWeight: 600, fontSize: "1rem" }}>
              ⬡ {points}
            </span>
          </div>
          <div
            style={{
              height: "1px",
              background: "rgba(255,255,255,0.07)",
              margin: "0.1rem 0",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--color-text-muted, #8b949e)", fontSize: "0.8rem" }}>Coins earned</span>
            {coinsEarned > 0 ? (
              <span
                style={{
                  color: "var(--color-success, #34d399)",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                🪙 +{coinsEarned}
              </span>
            ) : (
              <span style={{ color: "var(--color-text-muted, #8b949e)", fontSize: "0.85rem" }}>
                — <span style={{ fontSize: "0.7rem" }}>(need ≥20 pts)</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={onRetry}
            style={{
              padding: "0.6rem 1.4rem",
              background: "rgba(124, 131, 255, 0.15)",
              border: "1px solid var(--color-primary, #7c83ff)",
              borderRadius: "8px",
              color: "var(--color-primary, #7c83ff)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "rgba(124,131,255,0.28)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "rgba(124,131,255,0.15)")
            }
          >
            ↩ Play Again
          </button>
          <button
            onClick={onMain}
            style={{
              padding: "0.6rem 1.4rem",
              background: "transparent",
              border: "1px solid var(--color-border, #2d2d38)",
              borderRadius: "8px",
              color: "var(--color-text-secondary, #9ca3af)",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "border-color 150ms ease, color 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-text-muted)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
            }}
          >
            🏠 Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;

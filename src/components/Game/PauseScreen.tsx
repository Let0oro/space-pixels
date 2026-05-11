import React from "react";

interface PauseScreenProps {
  onResume: () => void;
  onMain: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume, onMain }) => (
  <div className="game-wrapper" style={{ justifyContent: "center", minHeight: "100vh" }}>
    <div
      style={{
        textAlign: "center",
        background: "rgba(13, 13, 26, 0.95)",
        border: "1px solid rgba(124, 131, 255, 0.3)",
        borderRadius: "12px",
        padding: "2.5rem 3rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        boxShadow: "0 0 40px rgba(124, 131, 255, 0.1)",
      }}
    >
      <div>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⏸</div>
        <h2
          style={{
            margin: 0,
            color: "var(--color-primary, #7c83ff)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            fontSize: "1.4rem",
          }}
        >
          PAUSED
        </h2>
        <p
          style={{
            margin: "0.75rem 0 0",
            color: "var(--color-text-muted, #8b949e)",
            fontSize: "0.8rem",
          }}
        >
          ◀ ▶ to move · ↑ to shoot
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <button
          onClick={onResume}
          style={{
            padding: "0.65rem 1.6rem",
            background: "var(--color-primary-light, rgba(124,131,255,0.18))",
            border: "1px solid var(--color-primary, #7c83ff)",
            borderRadius: "8px",
            color: "var(--color-primary, #7c83ff)",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.95rem",
            letterSpacing: "0.04em",
            transition: "background 150ms ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(124,131,255,0.32)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-light, rgba(124,131,255,0.18))")}
        >
          ▶ Resume
        </button>
        <button
          onClick={onMain}
          style={{
            padding: "0.5rem 1.6rem",
            background: "transparent",
            border: "1px solid var(--color-border, #2d2d38)",
            borderRadius: "8px",
            color: "var(--color-text-muted, #8b949e)",
            cursor: "pointer",
            fontSize: "0.8rem",
            transition: "border-color 150ms ease, color 150ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-error)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)";
          }}
        >
          🏠 Quit (points will be lost)
        </button>
      </div>
    </div>
  </div>
);

export default PauseScreen;

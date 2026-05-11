import { useNavigate } from "react-router-dom";

export const MessageToSL = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        background: "#08080f",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* Star field effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(124,131,255,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, rgba(212,95,220,0.06) 0%, transparent 60%)
          `,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        <div style={{ fontSize: "3rem" }}>🚀</div>

        <h2
          style={{
            margin: 0,
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            fontWeight: 700,
            color: "var(--color-text, #e5e7eb)",
            maxWidth: "420px",
            lineHeight: 1.4,
          }}
        >
          Your adventure awaits,{" "}
          <span style={{ color: "var(--color-primary, #7c83ff)" }}>pilot</span>.
        </h2>

        <p
          style={{
            margin: 0,
            color: "var(--color-text-muted, #8b949e)",
            fontSize: "0.9rem",
            maxWidth: "340px",
          }}
        >
          Create your pixel ship. Fight the invasion. Claim your rank.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "0.65rem 1.5rem",
              background: "var(--color-primary-light, rgba(124,131,255,0.18))",
              border: "1px solid var(--color-primary, #7c83ff)",
              borderRadius: "8px",
              color: "var(--color-primary, #7c83ff)",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.9rem",
              letterSpacing: "0.03em",
              transition: "background 150ms ease",
            }}
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "0.65rem 1.5rem",
              background: "transparent",
              border: "1px solid var(--color-border, #2d2d38)",
              borderRadius: "8px",
              color: "var(--color-text-secondary, #9ca3af)",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "border-color 150ms ease, color 150ms ease",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageToSL;

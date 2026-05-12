import "./App.css";
import { useState, useEffect, useRef } from "react";
import LogoSL from "./components/LogoSL";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Stable QueryClient — created once, not on every render
const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const { pathname: path } = useLocation();
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const testedRef = useRef(false);

  useEffect(() => {
    // Test autoplay permission once, when the crawl page first loads
    if (path === "/main" && !testedRef.current) {
      testedRef.current = true;
      const testAutoplay = async () => {
        try {
          const audio = new Audio();
          audio.volume = 0;
          await audio.play();
          audio.pause();
          // Autoplay permitted — no button needed
        } catch {
          // Autoplay blocked — show START button so the click provides the user gesture
          setAutoplayBlocked(true);
        }
      };
      testAutoplay();
    }
  }, [path]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LogoSL />

        <Outlet />

        {autoplayBlocked && path === "/main" && (
          <button
            onClick={() => {
              setAutoplayBlocked(false);
              // User gesture given — Entrance will retry audio.play() on next render
              navigate("/main");
            }}
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "0.8rem 2.5rem",
              background: "var(--color-primary-light, rgba(124,131,255,0.18))",
              border: "1px solid var(--color-primary, #7c83ff)",
              borderRadius: "10px",
              color: "var(--color-primary, #7c83ff)",
              fontWeight: 700,
              fontSize: "1.05rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(124,131,255,0.2)",
              animation: "startPulse 2s ease-in-out infinite",
              zIndex: 10,
            }}
          >
            ▶ START
          </button>
        )}
      </QueryClientProvider>
    </>
  );
}

export default App;

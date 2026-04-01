import "./App.css";
import { useState, useEffect } from "react";
import LogoSL from "./components/LogoSL";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const [start, setStart] = useState(false);
  const { pathname: path } = useLocation();

  useEffect(() => {
    if (path === "/") {
      setStart(false);
    } else {
      setStart(true);
    }
  }, [path]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LogoSL />

        <Outlet />
        {!start && (
          <button onClick={() => navigate("/main")}>Start</button>
        )}
      </QueryClientProvider>
    </>
  );
}

export default App;

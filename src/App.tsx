import "./App.css";
import { useMemo, useState } from "react";
import LogoSL from "./components/LogoSL";
import { Link, Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  const [start, setStart] = useState(false);
  const { pathname: path } = useLocation();

  useMemo(() => {
    if (["main"].includes(path) || path == "/") {
      setStart(false);
    } else setStart(true);
  }, [path]);

  const showLogoLS =
    ["/login", "/signup", "/main"].includes(path) || path == "/";

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LogoSL wanted={showLogoLS ? ["logo", "SL"] : ["logo"]} />

        <Outlet />
        {!start && (
          <button onClick={() => setStart(!start)}>
            <Link to="/main">Start</Link>
          </button>
        )}
      </QueryClientProvider>
    </>
  );
}

export default App;

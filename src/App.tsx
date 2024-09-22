import "./App.css";
import { useMemo, useState } from "react";
import LogoSL from "./components/LogoSL";
import { Link, Outlet, useLocation } from "react-router-dom";

function App() {
  const [start, setStart] = useState(false);
  const { pathname: path } = useLocation();

  useMemo(() => {
    if (["main"].includes(path) || path == "/") {
      setStart(false);
    } else setStart(true);
  }, [path]);

  return (
    <>
      <LogoSL wanted={["logo", "SL"]} />

      <Outlet />
      {!start && (
        <button onClick={() => setStart(!start)}>
          <Link to="/main">Start</Link>
        </button>
      )}
    </>
  );
}

export default App;

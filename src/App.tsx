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

  const showLogoLS = ["/login", "/signup", "/main"].includes(path) || path == "/"

  // console.log({path, showLogoLS})

  return (
    <>
      
      <LogoSL wanted={showLogoLS ? ["logo", "SL"]:  ["logo"]} />

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

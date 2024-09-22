import { Link } from "react-router-dom";
import "./App.css";
// import PixelStudio from "./pages/PixelStudio";
import {
  QueryClient,
  QueryClientProvider,
  // useQuery,
} from "@tanstack/react-query";
import Entrance from "./components/Entrance/Entrance";
import { useState } from "react";

const queryClient = new QueryClient();

function App() {
  const [start, setStart] = useState(false)

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <div style={{position: 'fixed', top: "1rem", right: "1rem", textAlign:"left"}}>
        <h4>Performance</h4>
        <ul>
          <li><b>EventCounts: </b>{window.performance.eventCounts.size}</li>
          <li><b>MemoryInfo: </b>(usedJSHeapSize
          ) {"->"} {window.performance?.memory?.usedJSHeapSize} bits</li>
          <li><b>domLoading: </b>{new Date(window.performance.timing.domLoading).getSeconds()} s</li>
          <li><b>domInteractive: </b>{new Date(window.performance.timing.domInteractive).getSeconds()} s</li>
        </ul>
      </div> */}

        <div style={{ ...styles.logRegDiv, position: "absolute" }}>
          <Link to="/signup">Sign Up</Link>
          <Link style={styles.loginBtn} to="/login">
            Login
          </Link>
        </div>
        <Link to="/">
          <h3 style={{ ...styles.logo, position: "absolute" }}>Spaces Pixel</h3>
        </Link>
        {start ? <Entrance /> :<button onClick={() => setStart(!start)} >Start</button>}
        {/* <PixelStudio /> */}
      </QueryClientProvider>
    </>
  );
}

const styles = {
  logRegDiv: {
    right: "1rem",
    top: "1rem",
    display: "flex",
    gap: "1rem",
  },
  loginBtn: {
    color: "#ffffffde",
    fontWeight: "bolder",
  },
  logo: {
    top: "1rem",
    margin: 0,
    left: "1rem",
  },
};

export default App;

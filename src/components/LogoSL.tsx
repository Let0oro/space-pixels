import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { FrontFetch } from "../utils/FrontFetch.ts";

const LogoSL = () => {
  const { setUser } = useUserContext();

  const { pathname: path } = useLocation();
  const newTo = ["/main", "/signup", "/pixel", "/login", "/"].includes(path)
    ? "/"
    : "usermain";

  const logRegDiv = (
    <div style={{ ...styles.logRegDiv, position: "absolute" }}>
      <Link to="/signup">Sign Up</Link>
      <Link style={styles.loginBtn} to="/login">
        Login
      </Link>
    </div>
  );

  const handleLogout = async () => {
    await FrontFetch.caller({
      name: "player",
      method: "post",
      typeMethod: "logout",
    });
  };

  const logoutDiv = (
    <div style={{ ...styles.logRegDiv, position: "absolute" }}>
      <button
        onClick={() => {
          setUser({});
          handleLogout();
        }}
      >
        <Link to="/">Logout</Link>
      </button>
    </div>
  );

  const logo = (
    <Link to={newTo}>
      <h3 style={{ ...styles.logo, position: "absolute" }}>Spaces Pixel</h3>
    </Link>
  );

  const returned = [];
  if (newTo == "/") {
    returned.push(logo, logRegDiv);
  } else returned.push(logo, logoutDiv);

  return (
    <div>
      {returned.map((el, ix) => (
        <div key={ix}>{el}</div>
      ))}
    </div>
  );
};

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

export default LogoSL;

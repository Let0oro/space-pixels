import { Link } from "react-router-dom";

interface LogoSLType {
  wanted: string[] | ["logo", "SL"];
}
const LogoSL = ({ wanted }: LogoSLType) => {

  const logRegDiv = (
    <div style={{ ...styles.logRegDiv, position: "absolute" }}>
      <Link to="/signup">Sign Up</Link>
      <Link style={styles.loginBtn} to="/login">
        Login
      </Link>
    </div>
  );

  const logo = (
    <Link to="/">
      <h3 style={{ ...styles.logo, position: "absolute" }}>Spaces Pixel</h3>
    </Link>
  );

  const returned = [];
  if (wanted.includes("logo")) returned.push(logo);
  if (wanted.includes("SL")) returned.push(logRegDiv);

  return <div>{returned.map((el, ix) => <div key={ix}>{el}</div>)}</div>;
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

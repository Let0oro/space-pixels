import { useEffect } from "react";
import { FrontFetch } from "../utils/FrontFetch";
import { Link } from "react-router-dom";
import PixelStudio from "./PixelStudio";
import { useUserContext } from "../context/userContext";

const UserMain = () => {
  const { user, setUser, rank, setRank } = useUserContext();

  if (!user) {
    useEffect(() => {
      const getUserFromSession = async () => {
        const { password: undefined, ...response } = await FrontFetch.caller({
          name: "user",
          method: "get",
          typeMethod: "session",
        });
        console.log({ response });
        setUser(response);
      };

      getUserFromSession();
    }, []);
  }

  if (!rank) {
    useEffect(() => {
      const getRanking = async () => {
        const { password: undefined, ...response } = await FrontFetch.caller({
          name: "score",
          method: "get",
        });
        console.log({ response });
        setRank(response);
      };

      getRanking();
    }, []);
  }

  const { name } = user;
  return (
    <>
      <h2>
        Welcome <span style={{ color: "#535BF2" }}>{name}</span>!
      </h2>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <Link to="">Collection</Link>
        <Link to="/settings">Settings</Link>
      </div>

      <Link to="/game">
        <h3 className="button_play">Play</h3>
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "450px",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        <div>
          <h4 style={{ margin: 0 }}>Give a spot to your ranking</h4>
          <div
            style={{ height: "360px", aspectRatio: 1, border: "1px solid red" }}
          ></div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ margin: 0 }}>Customize your ship</h4>
          <div style={{ width: "360px", border: "1px solid red" }}>
            <PixelStudio title={false} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMain;

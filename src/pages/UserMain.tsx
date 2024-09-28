import { useEffect } from "react";
import { FrontFetch } from "../utils/FrontFetch";
import { Link } from "react-router-dom";
import PixelStudio from "./PixelStudio";
import { useUserContext } from "../context/userContext";

const RankElement = ({
  currUser,
  rank,
}: {
  currUser?: string,
  rank: { username: string; points: number }[];
}) => {
  if (!rank) return <h4>Loading points...</h4>;
  if (!rank.length) {
    return (
      <h4>Not players registered yet or you dont have played any match</h4>
    );
  } else {
    return (
      <>
        {rank.sort(({points: pointsA}, {points: pointsB}) => pointsB - pointsA).map(({ username, points }) => (
          <p key={username}  style={{borderBottom: "1px solid red", margin: 0, padding: ".5rem 0"}}>
            <span style={{color: currUser === username ?  "#B836BA" : "#535BF2" }}>{username}:</span>
            <span> {points}</span>
          </p>
        ))}
      </>
    );
  }
};

const UserMain = () => {
  const { user, setUser, rank, setRank } = useUserContext();

  useEffect(() => {
    const getUserFromSession = async () => {
      const { password: undefined, ...response } = await FrontFetch.caller({
        name: "user",
        method: "get",
        typeMethod: "session",
      });
      setUser(response);
    };
    if (!user.id) getUserFromSession();
  }, []);

  useEffect(() => {
    const getRanking = async () => {
      const { password: undefined, ...response } = await FrontFetch.caller({
        name: "score",
        method: "get",
        typeMethod: "get",
      });
      setRank(Object.values(response));
    };
    if (!rank.length) getRanking();
  }, []);
  

  const { name } = user;
  return (
    <>
      <h2>
        Welcome <span style={{ color: "#535BF2" }}>{name}</span>!
      </h2>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <Link to="/collection"><h3 className="link_collection" >Collection</h3></Link>
        {/* <Link to="/settings">Settings</Link> */}
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
          >
            <RankElement currUser={name} rank={rank} />
          </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ margin: 0 }}>Customize your ship</h4>
          <div style={{ width: "360px" }}>
            <PixelStudio title={false} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMain;

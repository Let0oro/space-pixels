import { useEffect, useState } from "react";
import { FrontFetch } from "../utils/FrontFetch";
import { Link } from "react-router-dom";
import Canvas from "../components/PixelStudio/Canvas";
import PixelStudio from "./PixelStudio";

const UserMain = () => {
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    id?: number;
  }>({});

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

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "450px",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        <div style={{marginBottom: "2rem"}}>
          <h4 style={{ margin: 0 }}>Customize your ship</h4>
          <div
            style={{ width: "360px", border: "1px solid red" }}
          >
            <PixelStudio title={false}  />
          </div>
        </div>
        <div>
          <h4 style={{ margin: 0 }}>Give a spot to your ranking</h4>
          <div
            style={{ height: "360px", aspectRatio: 1, border: "1px solid red" }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default UserMain;

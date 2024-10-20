import { lazy, Suspense, useEffect, useState } from "react";
import { FrontFetch } from "../utils/FrontFetch.ts";
import { Link } from "react-router-dom";
import PixelStudio from "./PixelStudio";
import { useUserContext } from "../context/userContext";
import Dialog from "../components/Dialog";
import { useDialogContext } from "../context/dialogContext";
import useSessionExpired from "../hooks/useSessionExpired.tsx";

const ShipsList = lazy(() => import("../components/UserMain/ShipList.tsx"));
const RankElement = lazy(
  () => import("../components/UserMain/RankElement.tsx")
);

const UserMain = () => {
  const { user, rank, setRank, ships, setShips } = useUserContext();
  const { element } = useDialogContext();

  const [newShip, setNewShip] = useState<boolean>(false);

  useSessionExpired();

  useEffect(() => {
    const getRanking = async () => {
      const { password: undefined, ...response } = await FrontFetch.caller({
        name: "score",
        method: "get",
        typeMethod: "get",
      });
      const arrScore = Object.values(response) as {
        points: number;
        playername: string;
      }[];
      setRank(arrScore);
    };
    getRanking();
  }, [rank?.length, user.name]);

  useEffect(() => {
    const getShipsUser = async () => {
      const { id } = user;
      const response = await FrontFetch.caller({
        name: "ship",
        method: "get",
        typeMethod: "get",
        id: `${id}`,
      });
      setShips(response);
    };
    if (user.id) getShipsUser();
  }, [user?.name, ships.length, newShip, element?.open]);

  const { name, active_ship_id } = user;
  return (
    <>
      <Dialog />
      <h2>
        Welcome <span style={{ color: "#535BF2" }}>{name}</span>!
      </h2>
      <h4>Your ships collection</h4>
      <Suspense fallback={<h4>Loading player ships...</h4>}>
        <ShipsList
          user={user}
          ships={ships}
          player_selected={active_ship_id || 0}
        />
      </Suspense>
      <p
        style={{
          display: "flex",
          gap: "4px",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "clamp(.9rem, 2.5lvw, 1rem)",
        }}
      >
        Legend:{" "}
        <span style={{ backgroundColor: "green", padding: "4px 2px" }}>
          Published
        </span>{" "}
        <span style={{ backgroundColor: "gray", padding: "4px 2px" }}>
          Unpublished
        </span>{" "}
        <span style={{ border: "1px solid green", padding: "4px 2px" }}>
          Current selected
        </span>
      </p>
      <Link to="/shop" className="link_shop">
        Shop
      </Link>

      <Link
        to={user.active_ship_id ? "/game" : ""}
        style={{
          ...{ display: "block", width: "100%" },
          ...(!user.active_ship_id ? { filter: "grayscale(10)" } : {}),
        }}
      >
        <h3 className="button_play">Play</h3>
      </Link>
      {!user.active_ship_id && (
        <p style={{ margin: 0, color: "crimson" }}>
          You need a ship to play, please, select a ship from your collection
        </p>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxWidth: "780px",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        <div>
          <h4 style={{ margin: 0 }}>Give a spot to your ranking</h4>

          <Suspense fallback={<h4>Loading rank list...</h4>}>
            <RankElement currUser={name} rank={rank} />
          </Suspense>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <h4 style={{ margin: 0 }}>Create a new ship</h4>
          <div style={{ width: "360px" }}>
            <PixelStudio title={false} setNewShip={setNewShip} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMain;

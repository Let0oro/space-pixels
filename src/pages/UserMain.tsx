import { memo, useEffect, useState } from "react";
import { FrontFetch } from "../utils/FrontFetch";
import { Link, useNavigate } from "react-router-dom";
import PixelStudio from "./PixelStudio";
import { useUserContext } from "../context/userContext";

const RankElement = memo(
  ({
    currUser,
    rank,
  }: {
    currUser?: string;
    rank: { playername: string; points: number }[];
  }) => {
    if (!rank) return <h4>Loading points...</h4>;
    if (!rank.length) {
      return (
        <h4>Not players registered yet or you dont have played any match</h4>
      );
    } else {
      return (
        <div
          style={{
            height: "360px",
            aspectRatio: 1,
            border: "1px solid red",
            overflowY: "scroll",
            scrollbarWidth: "thin",
          }}
        >
          {[...rank]
            .sort(
              ({ points: pointsA }, { points: pointsB }) => pointsB - pointsA
            )
            .map(({ playername, points }, ix) => (
              <p
                key={ix}
                style={{
                  borderBottom: "1px solid red",
                  margin: 0,
                  padding: ".5rem 0",
                }}
              >
                <span
                  style={{
                    color: currUser === playername ? "#B836BA" : "#535BF2",
                  }}
                >
                  {playername}:
                </span>
                <span> {points}</span>
              </p>
            ))}
        </div>
      );
    }
  }
);

const ShipsList = memo(
  ({
    ships,
    player_selected,
  }: {
    ships: {
      pixels: string[];
      player_id: number;
      ship_id: number;
      store_id?: null | number;
    }[];
    player_selected: number;
  }) => {
    const { setUser, user, setShips } = useUserContext();
    const [publicMode, setPublicMode] = useState<boolean>(false);

    const deleteSelected = async () => {
      console.log("SADFADSFDFFDS");
      const response = await FrontFetch.caller({
        name: "ship",
        method: "delete",
        typeMethod: "one",
        id: String(user.active_ship_id),
      });
      console.log("deleteSelected");

      console.log({ response });

      console.log(
        ">>>>>>",
        ships.find((ship) => ship.ship_id == user.active_ship_id)
      );
      if (response) {
        setShips(
          ships.filter(({ ship_id: idDel }) => idDel != user.active_ship_id)
        );
        const response = await FrontFetch.caller(
          {
            name: "player",
            method: "put",
            typeMethod: "select",
            id: String(user.id),
          },
          { n_selected: null }
        );
        console.log({ response });
      }
    };

    const publicSelect = async (ship_id: number, store_id?: number | null) => {
      console.log({ store_id });
      const response = await FrontFetch.caller({
        name: "ship",
        method: store_id ? "delete" : "post",
        typeMethod: "post",
        id: `${store_id ? store_id : ship_id}`,
      });

      if (response) {
        const changedShip = ships.find((ship) => ship.ship_id == ship_id);

        const changedShipNo = ships.findIndex(
          (ship) => ship.ship_id == ship_id
        );

        if (response?.n_store_id && changedShip) {
          changedShip.store_id = response.n_store_id;
        } else {
          if (changedShip) changedShip.store_id = null;
        }
        const newShips = [...ships];
        if (changedShip) newShips.splice(changedShipNo, 1, changedShip);
        setShips(newShips);
      }
    };

    const changeSelected = async (ship_id: number) => {
      const response = await FrontFetch.caller(
        {
          name: "player",
          method: "put",
          typeMethod: "select",
          id: String(user.id),
        },
        { n_selected: ship_id }
      );
      if (response) setUser({ ...user, active_ship_id: ship_id });
    };

    useEffect(() => {
      console.log("ships changed");
    }, [setShips]);

    return (
      <div style={{ display: "flex", gap: ".4rem" }}>
        <div>
          <button onClick={() => setPublicMode((prev: boolean) => !prev)}>
            Select by public state
          </button>
        </div>
        <div
          style={{
            display: "flex",
            padding: "0 4px",
            // backgroundImage: "linear-gradient( to right, transparent 0%, red 50%, transparent 100%)",
            alignItems: "center",
            margin: "0 auto",
            gap: "8px",
            height: "45px",
            maxWidth: "200px",
            minWidth: "content",
            overflow: "auto hidden",
            scrollbarWidth: "thin",
            // border: "1px solid red",
          }}
        >
          {ships.map(({ pixels, ship_id, store_id }) => {
            // console.log({ pixels });
            const secArr = pixels[0].split(", ");

            const boxShadow = [];
            const pxLen = secArr.length;
            const origsize = Math.sqrt(pxLen);
            const varS = 32 / origsize;

            for (let i = 0; i < pxLen; i++) {
              const lineShadowRet = [];
              const currRow = secArr[i];
              const ix = i % origsize;
              lineShadowRet.push(
                `${varS * ix}px ${varS * Math.floor(i / origsize)}px 0 ${currRow.replace(/'/gi, "")}`
              );
              boxShadow.push(lineShadowRet.join(", "));
            }
            return (
              <div
                className="ship"
                key={ship_id}
                onClick={() =>
                  publicMode
                    ? store_id
                      ? publicSelect(ship_id, store_id)
                      : publicSelect(ship_id)
                    : changeSelected(ship_id)
                }
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: `${publicMode ? (store_id ? "green" : "gray") : "transparent"}`,
                  border: `1px solid ${ship_id == player_selected ? "green" : "transparent"}`,
                  minWidth: "32px",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    width: "4px",
                    boxShadow: boxShadow.join(", "),
                  }}
                ></div>
              </div>
            );
          })}
        </div>
        <button onClick={deleteSelected}>Del</button>
      </div>
    );
  }
);

const UserMain = () => {
  const { user, setUser, rank, setRank, ships, setShips } = useUserContext();

  const [newShip, setNewShip] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserFromSession = async () => {
      const { password: undefined, ...response } = await FrontFetch.caller({
        name: "player",
        method: "get",
        typeMethod: "session",
      });

      if (response.message == "session expired") navigate("/");
      setUser(response);
    };
    if (!user.id) getUserFromSession();
  }, [user?.name]);

  useEffect(() => {
    const getRanking = async () => {
      const { password: undefined, ...response } = await FrontFetch.caller({
        name: "score",
        method: "get",
        typeMethod: "get",
      });
      setRank(Object.values(response));
    };
    getRanking();
  }, [rank?.length]);

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
  }, [user?.name, ships?.length, newShip]);

  const { name, active_ship_id } = user;
  // console.log({ active_ship_id });
  return (
    <>
      <h2>
        Welcome <span style={{ color: "#535BF2" }}>{name}</span>!
      </h2>
      <h4>Your ships collection</h4>
      <ShipsList ships={ships} player_selected={active_ship_id || 1} />
      <p>
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
      {/* <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <Link to="/settings">Settings</Link>
      </div> */}

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

          <RankElement currUser={name} rank={rank} />
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

import { memo, useEffect, useState } from "react";
import { FrontFetch } from "../utils/FrontFetch.ts";
import { Link, useNavigate } from "react-router-dom";
import PixelStudio from "./PixelStudio";
import { useUserContext } from "../context/userContext";
import Dialog from "../components/Dialog";
import { useDialogContext } from "../context/dialogContext";
import shadowPixel from "../utils/shadowPixel";

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
            border: "1px solid #b836ba",
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
                  borderBottom: "1px solid #b836ba",
                  margin: 0,
                  padding: ".5rem 0",
                }}
              >
                <span> #{ix + 1} </span>
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
    user,
    ships,
    player_selected,
  }: {
    user: {
      name?: string;
      email?: string;
      active_ship_id?: number | null;
      coins?: number;
      id?: number;
      following_id?: number[] | null;
    };
    ships: {
      pixels: string[];
      player_id: number;
      ship_id: number;
      store_id?: null | number;
      from_other_id?: null | number;
    }[];
    player_selected: number;
  }) => {
    const { setUser, setShips } = useUserContext();
    const { element, setShipInfo, setType } = useDialogContext();
    const [publicMode, setPublicMode] = useState<boolean>(false);

    const deleteSelected = async () => {
      const response = await FrontFetch.caller({
        name: "ship",
        method: "delete",
        typeMethod: "one",
        id: String(user.active_ship_id),
      });

      if (response) {
        setShips(
          ships.filter(({ ship_id: idDel }) => idDel != user.active_ship_id)
        );
        setUser({ ...user, active_ship_id: null });
        await FrontFetch.caller(
          {
            name: "player",
            method: "put",
            typeMethod: "select",
            id: String(user.id),
          },
          { n_selected: null }
        );
      }
    };

    const publicSelect = async (
      ship_id: number,
      store_id?: number | null,
      from_other_id?: number | null
    ) => {
      if (from_other_id != null) return;
      setShipInfo({ ship_id, store_id });
      setType("public");
      element?.showModal();
    };

    const changeSelected = async (ship_id: number) => {
      if (!ship_id || !user.id) return;
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
      if (!user.active_ship_id && user.id && ships.length && ships[0].ship_id)
        changeSelected(ships[0].ship_id);
    }, [ships?.length, user?.id]);

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
            alignItems: "center",
            margin: "0 auto",
            gap: "8px",
            height: "45px",
            maxWidth: "180px",
            minWidth: "content",
            overflow: "auto hidden",
            scrollbarWidth: "thin",
          }}
        >
          {ships.map(({ pixels, ship_id, store_id, from_other_id }) => {
            const boxShadow = shadowPixel(pixels);
            return (
              <div
                className="ship"
                key={ship_id}
                onClick={() =>
                  publicMode
                    ? store_id
                      ? publicSelect(ship_id, store_id, from_other_id)
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
                    boxShadow: boxShadow,
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
  const { element } = useDialogContext();

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
  }, [user?.name, ships.length, newShip, element?.open]);

  const { name, active_ship_id } = user;
  return (
    <>
      <Dialog />
      <h2>
        Welcome <span style={{ color: "#535BF2" }}>{name}</span>!
      </h2>
      <h4>Your ships collection</h4>
      {user.id ? (
        <ShipsList
          user={user}
          ships={ships}
          player_selected={active_ship_id || 1}
        />
      ) : (
        <h4>Charging player ships...</h4>
      )}
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

import { memo, useEffect, useState } from "react";
import { useDialogContext } from "../context/dialogContext";
import { useUserContext } from "../context/userContext";
import { FrontFetch } from "../utils/FrontFetch";
import CardShip from "./Shop/CardShip";
import shadowPixel from "../utils/shadowPixel";

const UserProfile = memo(() => {
  const { otherUserId, type, element } = useDialogContext();
  const { user, setUser } = useUserContext();
  const [shipsProf, setShipsProf] = useState<
    {
      name: string;
      id: number;
      pixels: string[];
      store_id: number;
      ship_id: number;
      price: number;
      following_id: number[];
    }[] | null
  >();
  const {likes, setLikes} = useUserContext();
  const [isCurrentFollowing, setIsCurrentFollowing] = useState<boolean>(false);

  useEffect(() => {
    const getLikesPlayer = async () => {
      const response = await FrontFetch.caller({
        name: "ship",
        method: "get",
        typeMethod: "likedplayer",
      });
      if (response) setLikes(response);
    };
    getLikesPlayer();
  }, [type, element?.open]);

  useEffect(() => {
    const getShipsFromProfile = async () => {
      const response = await FrontFetch.caller({
        name: "ship",
        method: "get",
        typeMethod: "publicplayer",
        id: `${otherUserId}`,
      });
      if (response) setShipsProf(response);
    };
    getShipsFromProfile();

    return () => setShipsProf(null);
  }, [type, element?.open, otherUserId]);

  const followOrNot = async () => {
    const isCurrentFollowing =
      shipsProf &&
      user.following_id != null &&
      user.following_id.includes(shipsProf[0].id);

    const responseFol = await FrontFetch.caller({
      name: "player",
      method: "put",
      typeMethod: isCurrentFollowing ? "unfollow" : "follow",
      id: `${shipsProf && shipsProf[0].id}`,
    });

    if (responseFol) {
      let newFolUser;

      if (!isCurrentFollowing && shipsProf)
        newFolUser =
          user.following_id != null
            ? [...user.following_id, shipsProf[0].id]
            : [shipsProf[0].id];

      if (isCurrentFollowing && shipsProf && user.following_id != null)
        newFolUser = user.following_id.filter((fw) => fw != shipsProf[0].id);

      setUser({ ...user, following_id: newFolUser });
      setIsCurrentFollowing(!isCurrentFollowing);
    }
  };

  if (shipsProf && shipsProf[0].id != otherUserId || !shipsProf) {
    return <h3>Loading player...</h3>
  }

  if (shipsProf && shipsProf[0].id == otherUserId) return (
    <div style={{ marginBottom: "1rem" }}>
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {shipsProf && shipsProf[0].name}{" "}
        <button style={{ fontSize: ".8rem" }} onClick={followOrNot}  >
          {isCurrentFollowing ? "Unfollow" : "Follow"}
        </button>
      </h2>
      {shipsProf &&
        shipsProf.map(
          ({ pixels, ship_id, name, id: player_id, store_id, price }) => {
            const boxShadow = shadowPixel(pixels);
            return (
              <CardShip
                key={ship_id}
                store_id={store_id}
                name={name}
                ship_id={ship_id}
                player_id={player_id}
                boxShadow={boxShadow}
                price={price}
                isProfileScreen={true}
              />
            );
          }
        )}
    </div>
  );
});

const PublicShip = () => {
  const {
    shipInfo: { store_id, ship_id },
  } = useDialogContext();
  const { ships, setShips } = useUserContext();

  const publish = async (newPrice: number) => {
    console.log({ store_id });
    const response = await FrontFetch.caller(
      {
        name: "ship",
        method: store_id ? "delete" : "post",
        typeMethod: "post",
        id: `${store_id ? store_id : ship_id}`,
      },
      { newPrice }
    );

    if (response) {
      const changedShip = ships.find((ship) => ship.ship_id == ship_id);

      const changedShipNo = ships.findIndex((ship) => ship.ship_id == ship_id);

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

  return <></>;
};

const Dialog = () => {
  const { element, setElement, type } = useDialogContext();

  useEffect(() => {
    if (document) {
      setElement(document.querySelector("dialog"));
    }
  }, [element]);

  return (
    <dialog
      style={{
        width: "420px",
      }}
    >
      {type == "public" && <PublicShip />}
      {type == "user" && <UserProfile />}
      <button onClick={() => element && element.close()}>CLOSE</button>
    </dialog>
  );
};

export default Dialog;

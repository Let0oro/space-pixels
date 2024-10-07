import { memo, useEffect, useState } from "react";
import { useUserContext } from "../context/userContext";
import { FrontFetch } from "../utils/FrontFetch";
import { useNavigate } from "react-router-dom";
import CardShip from "../components/Shop/CardShip";
import Dialog from "../components/Dialog";
import shadowPixel from "../utils/shadowPixel";
import { useDialogContext } from "../context/dialogContext";

const ShipsList = memo(
  ({
    ships,
  }: {
    ships: {
      pixels: string[];
      player_id: number;
      ship_id: number;
      store_id?: null | number;
      name: string;
      price?: number;
    }[];
    player_selected?: number;
  }) => {

    const {setLikes} = useUserContext();
    const {element} = useDialogContext();

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
    }, [element?.open]);

    if (ships.length)
      return (
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              padding: "8px 16px",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              gap: "8px",
              flexWrap: "wrap",
              maxWidth: "420px",
              minWidth: "content",
            }}
          >
            {ships.sort(({store_id: a}, {store_id: b}) => a && b ? (a - b) : 0).map(({ pixels, ship_id, name, player_id, store_id, price }) => {

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
                />
              );
            })}
          </div>
        </div>
      );
  }
);

const Shop = () => {
  const { user, setUser } = useUserContext();
  const [publicShips, setPublicShips] = useState();
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
  }, [user?.coins]);

  useEffect(() => {
    const getPublicShips = async () => {
      const response = await FrontFetch.caller({
        name: "ship",
        method: "get",
        typeMethod: "public",
      });
      setPublicShips(response);
    };
    if (!publicShips) getPublicShips();
  }, []);

  return (
    <div>
      <Dialog  />
      <h3 style={{ position: "fixed", right: "1rem", bottom: 0 }}>
        coins: <span style={{color:"greenyellow"}}>{user.coins}</span>
      </h3>
      <h2>Shop</h2>
      <div>
        <ShipsList ships={publicShips ? publicShips : []} />
      </div>
    </div>
  );
};

export default Shop;

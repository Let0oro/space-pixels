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
        console.log({ responseLikes: response });
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
              // border: "1px solid red",
            }}
          >
            {ships.sort(({store_id: a}, {store_id: b}) => a && b ? (a - b) : 0).map(({ pixels, ship_id, name, player_id, store_id, price }) => {

              const boxShadow = shadowPixel(pixels);
              if (store_id && store_id == 1) console.log({cpu: "cpu", pixels, boxShadow});
              if (store_id && store_id> 100) console.log({me: "me", pixels, boxShadow});
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
  /*
  Descripción: 
  Cada jugador podrá ganar monedas según la puntuación que consiga jugando (p.e: 100p = 1coin)
  Cada jugador podrá poner en la tienda sus propias naves dibujadas a un precio entre 10 y 40 según su calidad
  Cada jugador podrá comprar naves (no muy caro porque podrían no usar el mercado)
  */
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
      // console.log(response);
    };
    if (!publicShips) getPublicShips();
  }, []);
  // console.log(user);

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

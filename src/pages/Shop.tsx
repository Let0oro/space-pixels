import { memo, useEffect, useMemo, useState } from "react";
import { useUserContext } from "../context/userContext";
import { FrontFetch } from "../utils/FrontFetch.ts";
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
    const { setLikes } = useUserContext();
    const { element } = useDialogContext();

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
            {ships
              .sort(({ store_id: a }, { store_id: b }) => (a && b ? a - b : 0))
              .map(({ pixels, ship_id, name, player_id, store_id, price }) => {
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
  const { user, setUser, likes } = useUserContext();
  const [publicShips, setPublicShips] = useState<any[]>();
  const [filter, setFilter] = useState<"all" | "liked" | "feed">("all");
  const navigate = useNavigate();

  const filteredShips = useMemo(() => {
    if (!publicShips || !publicShips.length || !likes.length || !user)
      return [];
    const desglosedLikes = likes.map(({ store_id }) => store_id);
    console.log({ desglosedLikes });
    const ships: { all: any[]; liked: any[]; feed: any[] } = {
      all: publicShips,
      liked: publicShips.filter((ship: any) =>
        desglosedLikes.includes(ship.store_id)
      ),
      feed: publicShips.filter((ship: any) =>
        user.following_id?.includes(ship.player_id)
      ),
    };
    return ships[filter];
  }, [filter, publicShips, user?.following_id, likes]);

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
      <Dialog />
      <h3 style={{ position: "fixed", right: "1rem", bottom: 0 }}>
        coins: <span style={{ color: "greenyellow" }}>{user.coins}</span>
      </h3>
      <h2>Shop</h2>
      <div
        style={{
          display: "flex",
          marginLeft: "1rem",
          justifyContent: "space-around",
        }}
      >
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("liked")}>Liked</button>
        <button onClick={() => setFilter("feed")}>Feed</button>
      </div>
      <div>
        <ShipsList ships={filteredShips} />
      </div>
    </div>
  );
};

export default Shop;

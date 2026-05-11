import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { FrontFetch } from "../utils/FrontFetch.ts";
import Dialog from "../components/Dialog";
import useSessionExpired from "../hooks/useSessionExpired.tsx";

const ShipsList = lazy(() => import("../components/Shop/ShipsList.tsx"));

const Shop = () => {
  const { user, likes } = useUserContext();
  const navigate = useNavigate();
  const [publicShips, setPublicShips] = useState<any[]>();
  const [filter, setFilter] = useState<"all" | "liked" | "feed">("all");

  // Guard: block mid-onboarding users from accessing the shop
  // before they've created their first ship.
  useEffect(() => {
    if (sessionStorage.getItem("sp_onboarding")) {
      navigate("/pixel", { replace: true });
    }
  }, []);

  const filteredShips = useMemo(() => {
    if (!publicShips || !publicShips.length || !user) return [];
    const safeLikes = Array.isArray(likes) ? likes : [];
    const desglosedLikes = safeLikes.map(({ store_id }) => store_id);
    const ships: { all: any[]; liked: any[]; feed: any[] } = {
      all: publicShips,
      liked: safeLikes.length
        ? publicShips.filter((ship: any) =>
            desglosedLikes.includes(ship.store_id)
          )
        : [],
      feed: publicShips.filter((ship: any) =>
        user.following_id?.includes(ship.player_id)
      ),
    };
    return ships[filter];
  }, [filter, publicShips, user?.following_id, likes]);

  useSessionExpired();

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
        🪙 <span style={{ color: "greenyellow" }}>{user.coins ?? "—"}</span>
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
        <Suspense fallback={<h4>Loading ships...</h4>}>
          <ShipsList ships={filteredShips} />
        </Suspense>
      </div>
    </div>
  );
};

export default Shop;

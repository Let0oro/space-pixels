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

  const safeLikes = Array.isArray(likes) ? likes : [];
  const hasLikes = safeLikes.length > 0;
  const hasFollowing = Array.isArray(user.following_id) && user.following_id.length > 0;

  const filteredShips = useMemo(() => {
    if (!publicShips || !publicShips.length || !user) return [];
    const desglosedLikes = safeLikes.map(({ store_id }) => store_id);
    const ships: { all: any[]; liked: any[]; feed: any[] } = {
      all: publicShips,
      liked: hasLikes
        ? publicShips.filter((ship: any) => desglosedLikes.includes(ship.store_id))
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

  const filterBtnStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
    padding: "0.35rem 1rem",
    borderRadius: "var(--border-radius-sm)",
    border: active
      ? "1px solid var(--color-primary)"
      : "1px solid var(--color-border)",
    background: active ? "var(--color-primary-light)" : "transparent",
    color: disabled
      ? "var(--color-text-muted)"
      : active
      ? "var(--color-primary)"
      : "var(--color-text-secondary)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "all var(--transition-fast)",
    fontSize: "0.875rem",
    fontWeight: active ? 500 : 400,
  });

  return (
    <div className="container">
      <Dialog />

      {/* Header row */}
      <div
        className="bg-surface rounded-md shadow-md p-md mb-md animate-fade-in"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}
      >
        <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>🚀 Ship Market</h2>

        {/* Coin balance */}
        <div className="bg-primary-light p-sm rounded-sm" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Balance:</span>
          <span style={{ color: "var(--color-success)", fontWeight: 700 }}>
            🪙 {user.coins ?? "—"}
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="bg-surface rounded-md shadow-sm p-sm mb-md"
        style={{ display: "flex", gap: "0.5rem" }}
      >
        <button
          style={filterBtnStyle(filter === "all", false)}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          disabled={!hasLikes}
          title={!hasLikes ? "Like a ship first to see your favourites here" : undefined}
          style={filterBtnStyle(filter === "liked", !hasLikes)}
          onClick={() => hasLikes && setFilter("liked")}
        >
          ❤ Liked
        </button>

        <button
          disabled={!hasFollowing}
          title={!hasFollowing ? "Follow a player first to see their ships here" : undefined}
          style={filterBtnStyle(filter === "feed", !hasFollowing)}
          onClick={() => hasFollowing && setFilter("feed")}
        >
          👥 Feed
        </button>
      </div>

      {/* Ships grid */}
      <div className="bg-surface rounded-md shadow-md p-md animate-fade-in">
        <Suspense fallback={
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            Loading ships...
          </div>
        }>
          <ShipsList ships={filteredShips} />
        </Suspense>
      </div>
    </div>
  );
};

export default Shop;

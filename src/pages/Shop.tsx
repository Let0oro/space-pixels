import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { FrontFetch } from "../utils/FrontFetch.ts";
import Dialog from "../components/Dialog";
import useSessionExpired from "../hooks/useSessionExpired.tsx";
import shadowPixel from "../utils/shadowPixel";

const ShipsList = lazy(() => import("../components/Shop/ShipsList.tsx"));

const Shop = () => {
  const { user, likes, ships: contextShips, setShips } = useUserContext();
  const navigate = useNavigate();
  const [publicShips, setPublicShips] = useState<any[]>();
  const [filter, setFilter] = useState<"all" | "liked" | "feed" | "sell">("all");
  const [sellLoading, setSellLoading] = useState(false);
  const [sellPrices, setSellPrices] = useState<Record<number, number>>({});

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
    if (filter === "sell") return [];
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

  useEffect(() => {
    if (filter !== "sell" || !user.id) return;
    if (Array.isArray(contextShips) && contextShips.length) return;
    const getMyShips = async () => {
      setSellLoading(true);
      try {
        const response = await FrontFetch.caller({
          name: "ship", method: "get", typeMethod: "get", id: `${user.id}`,
        });
        const ships = Array.isArray(response)
          ? response
          : response && typeof response === "object"
            ? Object.values(response).filter(
                (v): v is any => v && typeof v === "object" && "ship_id" in v
              )
            : [];
        if (ships.length) setShips(ships);
      } catch {
        // silent — context stays empty
      } finally {
        setSellLoading(false);
      }
    };
    getMyShips();
  }, [filter, user.id, contextShips?.length, setShips]);

  const handlePublish = useCallback(async (ship: any, price: number) => {
    const { ship_id, store_id: storeId } = ship;
    const currentShips = useUserContext.getState().ships;
    if (storeId) {
      const response = await FrontFetch.caller({
        name: "ship", method: "delete", typeMethod: "post", id: `${storeId}`,
      });
      if (response) {
        setShips(currentShips.map(s =>
          s.ship_id === ship_id ? { ...s, store_id: null } : s
        ));
      }
    } else {
      const response = await FrontFetch.caller(
        { name: "ship", method: "post", typeMethod: "post", id: `${ship_id}` },
        { new_price: price }
      );
      if (response?.n_store_id) {
        setShips(currentShips.map(s =>
          s.ship_id === ship_id ? { ...s, store_id: response.n_store_id } : s
        ));
      }
    }
  }, [setShips]);

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


        <button
          disabled={!user.id}
          title={!user.id ? "Log in to sell your ships" : undefined}
          style={filterBtnStyle(filter === "sell", !user.id)}
          onClick={() => user.id && setFilter("sell")}
        >
          💰 Sell
        </button>
      </div>

      {/* Ships grid */}
      <div className="bg-surface rounded-md shadow-md p-md animate-fade-in">
        {filter === "sell" ? (
          <SellSection
            ships={contextShips}
            loading={sellLoading}
            prices={sellPrices}
            onPriceChange={(shipId: number, price: number) =>
              setSellPrices(prev => ({ ...prev, [shipId]: price }))
            }
            onPublish={handlePublish}
          />
        ) : (
          <Suspense fallback={
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
              Loading ships...
            </div>
          }>
            <ShipsList ships={filteredShips} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

const SellSection = ({
  ships,
  loading,
  prices,
  onPriceChange,
  onPublish,
}: {
  ships: any[];
  loading: boolean;
  prices: Record<number, number>;
  onPriceChange: (shipId: number, price: number) => void;
  onPublish: (ship: any, price: number) => void;
}) => {
  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>Loading your ships...</div>;
  }
  if (!ships.length) {
    return <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>You have no ships to sell. Create one first!</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {ships.map((ship: any) => {
        const boxShadow = shadowPixel(ship.pixels);
        const isPublished = ship.store_id != null;
        const price = prices[ship.ship_id] ?? 20;
        const invalidPrice = price < 20 || price > 40;
        return (
          <div key={ship.ship_id} style={{
            display: "flex", alignItems: "center", gap: "1rem",
            padding: "0.75rem", borderBottom: "1px solid var(--color-border)",
          }}>
            <div style={{
              width: "32px", height: "32px", minWidth: "32px",
              background: isPublished ? "var(--color-success-light, rgba(0,200,83,0.1))" : "transparent",
              border: `1px solid ${isPublished ? "var(--color-success)" : "var(--color-border)"}`,
              borderRadius: "4px",
            }}>
              <div style={{ height: "4px", width: "4px", boxShadow }}></div>
            </div>
            <div style={{ flex: 1, fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>Ship #{ship.ship_id}</span>
              <span style={{
                marginLeft: "0.5rem", fontSize: "0.75rem",
                color: isPublished ? "var(--color-success)" : "var(--color-text-muted)",
              }}>
                {isPublished ? "Published" : "Unpublished"}
              </span>
            </div>
            {!isPublished && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>Price:</label>
                <input
                  type="number"
                  min={20}
                  max={40}
                  step={5}
                  value={price}
                  onChange={(e) => onPriceChange(ship.ship_id, Number(e.target.value))}
                  style={{
                    width: "60px", padding: "0.25rem 0.5rem",
                    border: invalidPrice ? "1px solid red" : "1px solid var(--color-border)",
                    borderRadius: "var(--border-radius-sm)", fontSize: "0.875rem",
                  }}
                />
                {invalidPrice && (
                  <span style={{ color: "red", fontSize: "0.75rem" }}>20-40</span>
                )}
              </div>
            )}
            <button
              onClick={() => onPublish(ship, price)}
              disabled={!isPublished && invalidPrice}
              style={{
                padding: "0.35rem 1rem",
                borderRadius: "var(--border-radius-sm)",
                border: `1px solid ${isPublished ? "var(--color-error)" : "var(--color-primary)"}`,
                background: isPublished ? "transparent" : "var(--color-primary-light)",
                color: isPublished ? "var(--color-error)" : "var(--color-primary)",
                cursor: (!isPublished && invalidPrice) ? "not-allowed" : "pointer",
                opacity: (!isPublished && invalidPrice) ? 0.5 : 1,
                fontSize: "0.875rem", fontWeight: 500,
              }}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Shop;

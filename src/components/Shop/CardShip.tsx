import { useState } from "react";
import { FrontFetch } from "../../utils/FrontFetch.ts";
import { useUserContext } from "../../context/userContext";
import { useDialogContext } from "../../context/dialogContext";

interface CardShipParams {
  ship_id?: number;
  name: string;
  boxShadow: string;
  player_id: number;
  store_id?: number | null;
  price?: number;
  isProfileScreen?: boolean;
}

const CardShip = ({
  ship_id: _ship_id,
  price,
  name,
  player_id,
  boxShadow,
  store_id,
  isProfileScreen = false,
}: CardShipParams) => {
  const { user, setUser, ships, likes, setLikes } = useUserContext();
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const { element, setOtherUserId, setType } = useDialogContext();

  const addLike = async () => {
    const response = await FrontFetch.caller(
      { name: "ship", method: "post", typeMethod: "like", id: `${player_id}` },
      { player: user, store_id }
    );
    if (response) {
      const newLikes = await FrontFetch.caller({
        name: "ship",
        method: "get",
        typeMethod: "likedplayer",
        id: `${user.id}`,
      });
      setLikes(Array.isArray(newLikes) ? newLikes : Object.values(newLikes ?? {}));
    }
  };

  const purchaseShip = async () => {
    if (user.coins == undefined || !price || user.coins - price < 0) return;
    const response = await FrontFetch.caller(
      { name: "ship", method: "post", typeMethod: "purchase", id: `${player_id}` },
      { player: user, store_id, price }
    );
    if (response) {
      setUser({ ...user, coins: user.coins != undefined && price ? user.coins - price : 0 });
      setIsPurchased(true);
    }
  };

  const showUserInfo = (otherUserId: number) => {
    setOtherUserId(otherUserId);
    setType("user");
    element?.showModal();
  };

  const storesIdLiked = Array.isArray(likes) ? likes.map((v) => v.store_id) : [];
  const isLikedFromMe: boolean = store_id ? storesIdLiked.includes(store_id) : false;
  const isOwn = user.id === player_id;
  const alreadyOwned = ships.some((sh) => sh.from_other_id === player_id);
  const cannotAfford = user.coins != undefined && price != undefined && user.coins < price;

  return (
    <div
      style={{
        width: "160px",
        background: "var(--color-surface)",
        border: `1px solid ${isOwn ? "var(--color-secondary)" : "var(--color-border)"}`,
        borderRadius: "var(--border-radius-md)",
        padding: "0.75rem 0.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.6rem",
        boxShadow: "var(--shadow-sm)",
        transition: "box-shadow var(--transition-fast), border-color var(--transition-fast)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
        if (!isOwn) (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
        (e.currentTarget as HTMLDivElement).style.borderColor = isOwn
          ? "var(--color-secondary)"
          : "var(--color-border)";
      }}
    >
      {/* Ship pixel preview */}
      <div
        style={{
          width: "32px",
          height: "32px",
          minHeight: "32px",
          minWidth: "32px",
          background: "rgba(0,0,0,0.3)",
          borderRadius: "var(--border-radius-sm)",
          padding: "4px",
          display: "block",
          alignItems: "center",
          justifyContent: "center",
          scale: "1.5",
          marginTop: "0.75rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ height: "4px", width: "4px", boxShadow }} />
      </div>

      {/* Player name button */}
      {!isProfileScreen && (
        <button
          onClick={() => showUserInfo(player_id)}
          style={{
            background: "none",
            border: "none",
            color: isOwn ? "var(--color-secondary)" : "var(--color-text-secondary)",
            fontSize: "0.75rem",
            cursor: "pointer",
            padding: "0",
            fontWeight: isOwn ? 600 : 400,
            maxWidth: "140px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={isOwn ? "Your ship" : `View ${name}'s profile`}
        >
          {isOwn ? "✦ " : ""}{name}
        </button>
      )}

      {/* Actions row — only for other players' ships */}
      {!isOwn && (
        <div style={{ display: "flex", gap: "0.4rem", width: "100%", justifyContent: "center" }}>
          {/* Purchase */}
          <button
            disabled={isPurchased || alreadyOwned || cannotAfford}
            onClick={purchaseShip}
            title={
              alreadyOwned
                ? "Already in your fleet"
                : cannotAfford
                ? "Not enough coins"
                : `Purchase for ${price} coins`
            }
            style={{
              flex: 1,
              padding: "0.25rem 0.4rem",
              fontSize: "0.7rem",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--color-border)",
              background: isPurchased || alreadyOwned
                ? "transparent"
                : "var(--color-primary-light)",
              color: isPurchased || alreadyOwned
                ? "var(--color-text-muted)"
                : cannotAfford
                ? "var(--color-error)"
                : "var(--color-primary)",
              cursor: isPurchased || alreadyOwned || cannotAfford ? "not-allowed" : "pointer",
              opacity: isPurchased || alreadyOwned ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.2rem",
              transition: "all var(--transition-fast)",
            }}
          >
            {isPurchased || alreadyOwned ? "✓" : (
              <>🪙 <span style={{ color: "var(--color-success)" }}>{price}</span></>
            )}
          </button>

          {/* Like */}
          <button
            onClick={addLike}
            title={isLikedFromMe ? "Unlike" : "Like this ship"}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "var(--border-radius-sm)",
              border: `1px solid ${isLikedFromMe ? "var(--color-error)" : "var(--color-border)"}`,
              background: isLikedFromMe ? "rgba(240,82,82,0.12)" : "transparent",
              color: isLikedFromMe ? "var(--color-error)" : "var(--color-text-muted)",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all var(--transition-fast)",
            }}
          >
            ❤
          </button>
        </div>
      )}
    </div>
  );
};

export default CardShip;

import { memo, useEffect } from "react";
import { FrontFetch } from "../../utils/FrontFetch";
import shadowPixel from "../../utils/shadowPixel";
import CardShip from "./CardShip";
import { useUserContext } from "../../context/userContext";
import { useDialogContext } from "../../context/dialogContext";

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
    const { user, setLikes } = useUserContext();
    const { element } = useDialogContext();

    useEffect(() => {
      const getLikesPlayer = async () => {
        const response = await FrontFetch.caller({
          name: "ship",
          method: "get",
          typeMethod: "likedplayer",
          id: `${user.id}`,
        });
        if (response) setLikes(Array.isArray(response) ? response : Object.values(response));
      };
      getLikesPlayer();
    }, [element?.open]);

    if (!ships?.length) {
      return (
        <div
          style={{
            padding: "2.5rem 1rem",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
          }}
        >
          No ships here yet.
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          padding: "0.5rem 0",
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
    );
  }
);

export default ShipsList;

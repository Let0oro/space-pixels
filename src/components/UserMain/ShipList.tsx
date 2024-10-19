import { memo, useEffect, useState } from "react";
import { useUserContext } from "../../context/userContext";
import { useDialogContext } from "../../context/dialogContext";
import { FrontFetch } from "../../utils/FrontFetch";
import shadowPixel from "../../utils/shadowPixel";

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

export default ShipsList;

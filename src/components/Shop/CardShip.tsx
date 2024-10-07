import { useState } from "react";
import { FrontFetch } from "../../utils/FrontFetch";
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
  ship_id,
  price,
  name,
  player_id,
  boxShadow,
  store_id,
  isProfileScreen = false
}: CardShipParams) => {

  const {user, setUser, ships, likes, setLikes} = useUserContext();
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const {element, setOtherUserId, setType} = useDialogContext()

  const addLike = async () => {
    console.log({player_id});
    const response = await FrontFetch.caller(
      { name: "ship", method: "post", typeMethod: "like", id: `${player_id}` },
      {store_id}
    );

    console.log({response});

    if (response) {
      const newLikes = await FrontFetch.caller({
        name: "ship",
        method: "get",
        typeMethod: "likedplayer",
      });
      setLikes(newLikes);
    }
  };

  const  purchaseShip = async () => {
    const response = await FrontFetch.caller(
      {
        name: "ship",
        method: "post",
        typeMethod: "purchase",
        id: `${player_id}`,
      },
      { store_id, price }
    );

    if (response) {
      console.log({responsePurchase: response});
      setUser({...user, coins: ((user.coins != undefined && price) ? user.coins - price : 0)});
      setIsPurchased(true);
    }

  };

  const showUserInfo = (otherUserId: number) => {
    setOtherUserId(otherUserId);
    setType("user");
    element?.showModal();
  }

  const storesIdLiked = likes?.map((v) => v.store_id);
  // console.log({storesIdLiked});
  const isLikedFromMe: boolean =
    storesIdLiked && store_id ? storesIdLiked?.includes(store_id) : false;

  const otherIdsFromMyShips = ships.map(sh => sh.from_other_id);

  return (
    <div
      key={ship_id}
      style={{
        padding: "4px 8px",
        width: "180px",
        height: "150px",
        border: `1px solid ${user.id == player_id ? "#b836ba" : ""}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          minHeight: "32px",
          minWidth: "32px",
          boxShadow: "0px 0px 4px gray",
          padding: "4px",
          display: "block",
          scale: "1.5",
        }}
      >
        <div
          style={{
            height: "4px",
            width: "4px",
            boxShadow,
          }}
        ></div>
      </div>

      {user.id != player_id && <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <button
          disabled={isPurchased || otherIdsFromMyShips.includes(player_id)}
          style={{
            marginTop: ".5rem",
            padding: "2px 4px",
            display: "flex",
          }}
          onClick={purchaseShip}
        >
          Purchase (<span style={{color: "greenyellow", display: "block"}}>{price}</span>)
        </button>
        <button
          style={{
            padding: "2px 4px",
            color: isLikedFromMe ? "red" : "white",
          }}
          onClick={addLike}
        >
          ❤
        </button>
      </div>}
      {!isProfileScreen && <button onClick={() => showUserInfo(player_id)}>{name}</button>}
    </div>
  );
};

export default CardShip;

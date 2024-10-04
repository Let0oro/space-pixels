import { memo, useEffect, useState } from "react"
import { useUserContext } from "../context/userContext";
import { FrontFetch } from "../utils/FrontFetch";
import { useNavigate } from "react-router-dom";


const ShipsList = memo(
  ({
    ships,
  }: {
    ships: { pixels: string[]; player_id: number; ship_id: number, store_id?: null | number, name: string }[];
    player_selected?: number;
  }) => {
    // const { user, setShips } = useUserContext();

    console.log({ships})

    if (ships.length) return (
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            padding: "8px 16px",
            // backgroundImage: "linear-gradient( to right, transparent 0%, red 50%, transparent 100%)",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            gap: "8px",
            flexWrap: "wrap",
            maxWidth: "320px",
            minWidth: "content",
            // border: "1px solid red",
          }}
        >
          {ships.map(({ pixels, ship_id, name }) => {
            // console.log({ pixels });

            const boxShadow = [];
            const pxLen = pixels.length;
            const origsize = Math.sqrt(pxLen);
            const varS = 32 / origsize;

            for (let i = 0; i < pxLen; i++) {
              const lineShadowRet = [];
              const currRow = pixels[i];
              const ix = i % origsize;
              lineShadowRet.push(
                `${varS * ix}px ${varS * Math.floor(i / origsize)}px 0 ${currRow.replace(/'/gi, "")}`
              );
              boxShadow.push(lineShadowRet.join(", "));
            }
            return (
              <div
              key={ship_id}
              title={name}
                style={{
                  width: "32px",
                  height: "32px",
                  minWidth: "32px",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    width: "4px",
                    boxShadow: boxShadow.join(", "),
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
  


const Shop = () => {
  const {user, setUser} = useUserContext();
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
      const response = await FrontFetch.caller({name: "ship", method: "get", typeMethod: "public"});
      setPublicShips(response);
      console.log(response);
    }
    if (!publicShips) getPublicShips();
  }, []);
  console.log(user);

  return (
    <div >
      <h3 style={{position: "absolute", right: "1rem", bottom: 0}}>Coins: {user.coins}</h3>
      <h2>Shop</h2>
      <div>
        <ShipsList ships={publicShips ? publicShips : []} />
      </div>

    </div>
  )
}

export default Shop
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { FrontFetch } from "../utils/FrontFetch";

const useSessionExpired = () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    const getUserFromSession = async () => {
      try {
        const strUser = localStorage.getItem("user");
        const { password: undefined, ...response } = strUser ? JSON.parse(strUser) : {}

        if (!response?.name && !response?.nameoremail) return;
        console.log({ strUser });
        console.log("strsee");
        if (!strUser) return navigate("/");
        const player = await FrontFetch.caller({
          name: "player",
          method: "get",
          typeMethod: "get",
          id: response?.name
            ? response?.name
            : response?.nameoremail
        });
        console.log({ player });


        const playerData = Array.isArray(player) ? player[0] : (player?.player?.[0] ?? player);
        if (playerData?.id) setUser(playerData);

        let parseUserLocalStorage: any = localStorage.getItem("user");
        parseUserLocalStorage = parseUserLocalStorage ? JSON.parse(parseUserLocalStorage) : {};

        if (parseUserLocalStorage?.name || parseUserLocalStorage?.id || parseUserLocalStorage?.active_ship_id) {
          localStorage.setItem("user", JSON.stringify({ password: undefined, ...playerData }))
        }
      } catch (error) {
        console.warn({ error });
        navigate("/");
      }
    };
    if (!user.id || user?.coins == null) getUserFromSession();
  }, [user?.name, user?.coins]);
};

export default useSessionExpired;

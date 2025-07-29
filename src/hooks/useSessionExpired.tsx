import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { FrontFetch } from "../utils/FrontFetch";

const useSessionExpired = async () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    const getUserFromSession = async () => {
      try {
        const strUser = localStorage.getItem("user");
        const { password: undefined, ...response } = strUser ? JSON.parse(strUser) : {}

        if (!response?.name && !response?.nameoremail) return;
        console.log({strUser});
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
        console.log({player});


        if (!user?.id || !user?.name || !user?.active_ship_id) setUser(player);

        let parseUserLocalStorage: any = localStorage.getItem("user");
        parseUserLocalStorage = parseUserLocalStorage ? JSON.parse(parseUserLocalStorage) : {};

        if (parseUserLocalStorage?.name || parseUserLocalStorage?.id || parseUserLocalStorage?.active_ship_id) {
          localStorage.setItem("user", JSON.stringify({ password: undefined, ...player }))
        }
      } catch (error) {
        console.warn({error});
        navigate("/");
      }
    };
    if (!user.id || user?.coins == null) getUserFromSession();
  }, [user?.name, user?.coins]);
};

export default useSessionExpired;

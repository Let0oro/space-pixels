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
        if (!strUser) return navigate("/");
        const [player] = await FrontFetch.caller({name: "player", method: "get", typeMethod: "get", id: response.name}) 

        console.table({response, player})
        setUser(player);
        localStorage.setItem("user", JSON.stringify({name: player.name, id: player.id, email: player.email}))
      } catch (error) {
        console.error({ error });
        navigate("/");
      }
    };
    if (!user.id || user?.coins == null) getUserFromSession();
  }, [user?.name, user?.coins]);
};

export default useSessionExpired;

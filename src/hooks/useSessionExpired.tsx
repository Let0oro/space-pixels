import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FrontFetch } from "../utils/FrontFetch";
import { useUserContext } from "../context/userContext";

const useSessionExpired = () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    const getUserFromSession = async () => {
      try {
        // const { password: undefined, ...response } = await FrontFetch.caller({
        //   name: "player",
        //   method: "get",
        //   typeMethod: "session",
        // });
        // console.log({ sessionResponse: response });
        // if (response.error) navigate("/");
        // setUser(response);
        const strUser = localStorage.getItem("user");
        const { password: undefined, ...response } = strUser ? JSON.parse(strUser) : {}
        if (!response) return navigate("/");
        console.log({response})
        setUser(response);
      } catch (error) {
        console.error({ error });
        navigate("/");
      }
    };
    if (!user.id) getUserFromSession();
  }, [user?.name, user?.coins]);
};

export default useSessionExpired;

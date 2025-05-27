import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./components/ErrorPage";
import Entrance from "./components/Entrance/Entrance";
import PixelStudio from "./pages/PixelStudio";
import UserMain from "./pages/UserMain";
import Shop from "./pages/Shop";
import Game from "./pages/Game/Game";
import LogSign from "./pages/LogSign";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "main",
        element: <Entrance />,
      },
      {
        path: "login",
        element: <LogSign type="login" />
      },
      {
        path: "signup",
        element: <LogSign type="register" />
      },
      {
        path: "pixel",
        element: <PixelStudio />
      },
      {
        path: "usermain",
        element: <UserMain />,
      },
      {
        path: "shop",
        element: <Shop />
      },
      {
        path: "game",
        element: <Game />
      },
    ],
  },

])
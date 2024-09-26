import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage.tsx";
import Entrance from "./components/Entrance/Entrance.tsx";
import PixelStudio from "./pages/PixelStudio.tsx";
import Settings from "./pages/Settings.tsx";
import LogSing from "./pages/LogSign.tsx";
import Game from "./pages/Game.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage  />,
    children: [
      {
        path: "main",
        element: <Entrance />,
      },
      {
        path: "/login",
        element: <LogSing type="login" />
      },
      {
        path: "/signup",
        element: <LogSing type="register" />
      },
    ],
  },
  {
    path: "/pixel",
    element: <PixelStudio  />
  },
  {
    path: "/settings",
    element: <Settings  />
  },
  {
    path: "/game",
    element: <Game  />
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

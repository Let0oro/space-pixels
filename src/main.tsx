import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage.tsx";
import Entrance from "./components/Entrance/Entrance.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage  />,
    children: [
      {
        path: "/app",
        element: <Entrance />,
      },
      {
        path: "/login",
      },
      {
        path: "/signup",
      },
      {
        path: "/game",
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

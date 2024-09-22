import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage  />,
    children: [
      {
        path: "/login",
      },
      {
        path: "/register",
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
    <App />
  </StrictMode>
);

import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import App from "./App";
import ErrorPage from "./components/ErrorPage";
import { useUserContext } from "./context/userContext";

// Lazy load components for code splitting
const Entrance = lazy(() => import("./components/Entrance/Entrance"));
const PixelStudio = lazy(() => import("./pages/PixelStudio"));
const UserMain = lazy(() => import("./pages/UserMain"));
const Shop = lazy(() => import("./pages/Shop"));
const Game = lazy(() => import("./pages/Game/Game"));
const LogSign = lazy(() => import("./pages/LogSign"));

/**
 * Route metadata interface
 */
export interface RouteMetadata {
  /** Page title */
  title: string;
  /** Layout type */
  layout: 'default' | 'wide' | 'narrow' | 'full';
  /** Whether authentication is required */
  requireAuth: boolean;
  /** Meta description for SEO */
  description?: string;
}

/**
 * Route metadata configuration
 */
export const routeMetadata: Record<string, RouteMetadata> = {
  '/': {
    title: 'Home',
    layout: 'full',
    requireAuth: false,
    description: 'Welcome to Space Pixels - The ultimate space adventure game',
  },
  '/main': {
    title: 'Home',
    layout: 'full',
    requireAuth: false,
    description: 'Welcome to Space Pixels - The ultimate space adventure game',
  },
  '/login': {
    title: 'Login',
    layout: 'narrow',
    requireAuth: false,
    description: 'Log in to your Space Pixels account',
  },
  '/signup': {
    title: 'Sign Up',
    layout: 'narrow',
    requireAuth: false,
    description: 'Create a new Space Pixels account',
  },
  '/pixel': {
    title: 'Pixel Studio',
    layout: 'full',
    requireAuth: false,
    description: 'Create and customize your own spaceship designs',
  },
  '/usermain': {
    title: 'Dashboard',
    layout: 'default',
    requireAuth: true,
    description: 'Your personal Space Pixels dashboard',
  },
  '/shop': {
    title: 'Shop',
    layout: 'wide',
    requireAuth: false,
    description: 'Browse and purchase spaceships for your collection',
  },
  '/game': {
    title: 'Game',
    layout: 'full',
    requireAuth: false,
    description: 'Play the Space Pixels game',
  },
};

/**
 * Loading component for route transitions
 */
const RouteLoading = () => (
  <div className="flex justify-center items-center p-lg animate-pulse">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <p className="ml-md">Loading...</p>
  </div>
);

/**
 * Auth guard component to protect routes
 */
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();
  const isAuthenticated = !!user.id;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Create the router with all routes and configurations
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteLoading />}>
            <Entrance />
          </Suspense>
        ),
      },
      {
        path: "main",
        element: (
          <Suspense fallback={<RouteLoading />}>
            <Entrance />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<RouteLoading />}>
            <LogSign type="login" />
          </Suspense>
        ),
      },
      {
        path: "signup",
        element: (
          <Suspense fallback={<RouteLoading />}>
            <LogSign type="register" />
          </Suspense>
        ),
      },
      {
        path: "pixel",
        element: (
          <Suspense fallback={<RouteLoading />}>
            <PixelStudio />
          </Suspense>
        ),
      },
      {
        path: "usermain",
        element: (
          <Suspense fallback={<RouteLoading />}>
            <AuthGuard>
              <UserMain />
            </AuthGuard>
          </Suspense>
        ),
      },
      {
        path: "shop",
        element: (
          <Suspense fallback={<RouteLoading />}>
            <Shop />
          </Suspense>
        ),
      },
      {
        path: "game",
        element: (
          <Suspense fallback={<RouteLoading />}>
            <Game />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <ErrorPage />
        ),
      },
    ],
  },
]);

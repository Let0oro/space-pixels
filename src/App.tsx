import "./App.css";
import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainTemplate } from "./components/templates/MainTemplate";
import { Button } from "./components/atoms/Button";
import { useUserContext } from "./context/userContext";

/**
 * Interface for route-specific layout configuration
 */
interface RouteConfig {
  title: string;
  layout: 'default' | 'wide' | 'narrow' | 'full';
  requireAuth: boolean;
}

/**
 * App component - Main application wrapper
 */
function App() {
  // Initialize query client
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }), []);
  
  // State for start button and loading
  const [start, setStart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get location and user context
  const { pathname: path } = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const isAuthenticated = !!user.id;

  // Route configuration mapping
  const routeConfig: Record<string, RouteConfig> = useMemo(() => ({
    '/': { title: 'Home', layout: 'full', requireAuth: false },
    '/main': { title: 'Home', layout: 'full', requireAuth: false },
    '/login': { title: 'Login', layout: 'narrow', requireAuth: false },
    '/signup': { title: 'Sign Up', layout: 'narrow', requireAuth: false },
    '/usermain': { title: 'Dashboard', layout: 'default', requireAuth: true },
    '/shop': { title: 'Shop', layout: 'wide', requireAuth: false },
    '/pixel': { title: 'Pixel Studio', layout: 'full', requireAuth: false },
    '/game': { title: 'Game', layout: 'full', requireAuth: false },
  }), []);

  // Get current route config
  const currentRoute = useMemo(() => 
    routeConfig[path] || { title: 'Space Pixels', layout: 'default', requireAuth: false },
  [path, routeConfig]);

  // Update start state based on path
  useEffect(() => {
    if (["main", "/"].includes(path) || path === "/") {
      setStart(false);
    } else {
      setStart(true);
    }
    
    // Simulate page transition loading effect
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [path]);
  
  // Handle authentication requirements
  useEffect(() => {
    if (currentRoute.requireAuth && !isAuthenticated) {
      // Don't redirect from login/signup pages
      if (!['/login', '/signup'].includes(path)) {
        navigate('/login');
      }
    }
  }, [currentRoute.requireAuth, isAuthenticated, path, navigate]);

  // Handle Start button click
  const handleStart = () => {
    setStart(true);
    navigate('/main');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MainTemplate
        title={`Space Pixels | ${currentRoute.title}`}
        layout={currentRoute.layout}
        isLoading={isLoading}
        errorMessage={error}
        requireAuth={currentRoute.requireAuth}
        customStyle={{ position: 'relative' }}
        hideFooter={['/game', '/pixel'].includes(path)}
      >
        {/* Main content */}
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
        
        {/* Start button for home page */}
        {!start && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
          }}>
            <Button
              variant="primary"
              onClick={handleStart}
              customStyle={{
                padding: '1rem 3rem',
                fontSize: '1.2rem',
                animation: 'pulse 1.5s infinite',
              }}
            >
              Start Adventure
            </Button>
          </div>
        )}
      </MainTemplate>
    </QueryClientProvider>
  );
}

export default App;

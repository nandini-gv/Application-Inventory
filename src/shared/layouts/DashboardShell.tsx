import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalSearch } from '../../components/GlobalSearch';
import { useAuth } from '../hooks/useAuth';

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 76;

export const DashboardShell: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, isAuthenticating } = useAuth();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Protect route: Redirect if not authenticated and not loading
  useEffect(() => {
    if (!isAuthenticating && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isAuthenticating, navigate]);

  // Listen for keyboard command shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isAuthenticating) {
    // Elegant full-screen loading skeleton
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#030303',
        }}
      >
        <Box className="bg-grid" />
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.05)',
            borderTopColor: 'primary.main',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null; // Route protection handles redirect
  }

  const currentSidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#030303' }}>
      <Box className="bg-grid" />

      {/* Collapsible Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        width={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      />

      {/* Content wrapper */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          paddingLeft: `${currentSidebarWidth}px`,
          transition: 'padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Header */}
        <Header
          onSearchOpen={() => setSearchOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          sidebarWidth={SIDEBAR_WIDTH}
          sidebarCollapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        />

        {/* Scrollable Main Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: '88px', // Header offset (64px) + margin padding
            pb: 4,
            px: { xs: 2, sm: 4, md: 5 },
            width: '100%',
            maxWidth: 1600,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Outlet renders active page route */}
          <Outlet />
        </Box>
      </Box>

      {/* Global Search dialog */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
  );
};

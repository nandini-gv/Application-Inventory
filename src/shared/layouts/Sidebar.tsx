import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  DashboardOutlined as DashboardIcon,
  FolderOpenOutlined as FolderIcon,
  AppRegistrationOutlined as RegisterIcon,
  BarChartOutlined as AnalyticsIcon,
  SettingsOutlined as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  LogoutOutlined as LogoutIcon,
  Layers as LogoIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  width: number;
  collapsedWidth: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, width, collapsedWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', tooltip: 'Overview & metrics' },
    { text: 'Applications', icon: <FolderIcon />, path: '/applications', tooltip: 'Enterprise application inventory' },
    { text: 'Register Application', icon: <RegisterIcon />, path: '/register', tooltip: 'Add new application registry' },
    { text: 'Insights', icon: <AnalyticsIcon />, path: '/insights', tooltip: 'System metrics & distribution charts' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', tooltip: 'Configurations & endpoints settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <Box
      sx={{
        width: collapsed ? collapsedWidth : width,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'rgba(13, 14, 18, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Brand Logo & Collapse Toggle */}
      <Box
        sx={{
          p: 2,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
          <LogoIcon sx={{ color: 'primary.light', fontSize: 28 }} />
          {!collapsed && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #FFFFFF, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              App Hub
            </Typography>
          )}
        </Box>
        {!collapsed && (
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              color: 'text.secondary',
              bgcolor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.06)' },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Collapse button when sidebar is collapsed */}
      {collapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              color: 'text.secondary',
              bgcolor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.06)' },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, px: 1.5, py: 2 }}>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const isActive = item.path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(item.path);
            const buttonContent = (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.8,
                  px: 1.8,
                  py: 1.2,
                  justifyContent: collapsed ? 'center' : 'initial',
                  bgcolor: isActive ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'text.secondary',
                  border: isActive ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(124, 58, 237, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    color: '#FFFFFF',
                    '& .item-icon': {
                      color: isActive ? 'primary.light' : '#FFFFFF',
                      transform: 'scale(1.05)',
                    },
                  },
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <ListItemIcon
                  className="item-icon"
                  sx={{
                    minWidth: collapsed ? 0 : 36,
                    color: isActive ? 'primary.light' : 'text.secondary',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    {...{
                      primaryTypographyProps: {
                        variant: 'body2',
                        fontWeight: isActive ? 600 : 500,
                        letterSpacing: '-0.01em',
                      }
                    } as any}
                  />
                )}
              </ListItemButton>
            );

            return collapsed ? (
              <Tooltip key={item.text} title={item.tooltip} placement="right" arrow>
                {buttonContent}
              </Tooltip>
            ) : (
              buttonContent
            );
          })}
        </List>
      </Box>

      {/* User Section / Bottom Menu */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: collapsed ? 2 : 1.5,
          alignItems: collapsed ? 'center' : 'stretch',
        }}
      >
        {!collapsed && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1 }}>
            <Avatar
              src={user.avatarUrl}
              alt={user.displayName}
              sx={{
                width: 38,
                height: 38,
                bgcolor: 'primary.main',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              {user.displayName.substring(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontWeight: 600,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                }}
              >
                {user.displayName}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                color="text.secondary"
                sx={{
                  display: 'block',
                  fontSize: '0.72rem',
                  lineHeight: 1.2,
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}

        {collapsed && user && (
          <Tooltip title={`${user.displayName} (${user.email})`} placement="right" arrow>
            <Avatar
              src={user.avatarUrl}
              alt={user.displayName}
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
              }}
            >
              {user.displayName.substring(0, 2).toUpperCase()}
            </Avatar>
          </Tooltip>
        )}

        <Divider sx={{ opacity: 0.1 }} />

        {collapsed ? (
          <Tooltip title="Sign Out" placement="right" arrow>
            <IconButton
              onClick={handleLogout}
              size="small"
              sx={{
                color: 'text.secondary',
                bgcolor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                  color: 'error.light',
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                },
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              px: 1.8,
              py: 1,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: 'error.light',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                '& .logout-icon': { color: 'error.light' },
              },
              border: '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon
              className="logout-icon"
              sx={{
                minWidth: 36,
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                '& svg': { fontSize: 20 },
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              {...{
                primaryTypographyProps: {
                  variant: 'body2',
                  fontWeight: 500,
                }
              } as any}
            />
          </ListItemButton>
        )}
      </Box>
    </Box>
  );
};

import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  NotificationsOutlined as NotificationsIcon,
  ChevronRight as ChevronRightIcon,
  PersonOutlined as ProfileIcon,
  SettingsOutlined as SettingsIcon,
  LogoutOutlined as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onSearchOpen: () => void;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchOpen,
  sidebarCollapsed,
  sidebarWidth,
  sidebarCollapsedWidth,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const AnyMenu = Menu as any;

  // Notification Anchor state
  const [notiAnchor, setNotiAnchor] = useState<null | HTMLElement>(null);
  // Profile Anchor state
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'SharePoint Request Approved', desc: 'Your registration request for SharePoint Catalog has been authorized by DevOps.', time: '10m ago', unread: true },
    { id: 2, title: 'API Key Expiring', desc: 'Your developer environment sandbox token expires in 48 hours.', time: '2h ago', unread: true },
    { id: 3, title: 'Telemetry Update', desc: 'Azure AD integration stats have successfully refreshed.', time: '1d ago', unread: false },
  ]);

  const handleProfileClick = (e: React.MouseEvent<HTMLElement>) => setProfileAnchor(e.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleNotiClick = (e: React.MouseEvent<HTMLElement>) => setNotiAnchor(e.currentTarget);
  const handleNotiClose = () => setNotiAnchor(null);

  const handleClearNoti = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleLogoutClick = async () => {
    handleProfileClose();
    await logout();
    navigate('/login');
  };

  // Generate breadcrumbs from path
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbItems = pathnames.map((value, index) => {
    const last = index === pathnames.length - 1;
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    const displayName = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');

    return last ? (
      <Typography key={to} variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
        {displayName}
      </Typography>
    ) : (
      <Link key={to} to={to} style={{ textDecoration: 'none', color: '#9CA3AF' }}>
        <Typography variant="body2" sx={{ '&:hover': { color: 'text.primary' } }}>
          {displayName}
        </Typography>
      </Link>
    );
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Box
      sx={{
        height: 64,
        position: 'fixed',
        top: 0,
        right: 0,
        left: sidebarCollapsed ? sidebarCollapsedWidth : sidebarWidth,
        zIndex: (theme) => theme.zIndex.drawer,
        bgcolor: 'rgba(3, 3, 3, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumbs
          separator={<ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />}
          aria-label="breadcrumb"
          sx={{ '& ol': { display: 'flex', alignItems: 'center' } }}
        >
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#9CA3AF' }}>
            <Typography variant="body2" sx={{ '&:hover': { color: 'text.primary' } }}>
              Application Hub
            </Typography>
          </Link>
          {breadcrumbItems}
        </Breadcrumbs>
      </Box>

      {/* Action Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Fake Search bar triggers Cmd+K modal */}
        <Box
          onClick={onSearchOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 2,
            px: 2,
            py: 0.8,
            width: 240,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.04)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
            },
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, userSelect: 'none', fontSize: '0.82rem' }}>
            Search...
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 1,
              px: 0.6,
              py: 0.2,
            }}
          >
            <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary' }}>
              ⌘K
            </Typography>
          </Box>
        </Box>

        {/* Notifications Icon */}
        <IconButton
          onClick={handleNotiClick}
          size="medium"
          sx={{
            color: 'text.secondary',
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', color: 'text.primary' },
          }}
        >
          <Badge badgeContent={unreadCount} color="primary" variant="dot">
            <NotificationsIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>

        {/* User Mini Dropdown */}
        {user && (
          <IconButton onClick={handleProfileClick} sx={{ p: 0.5 }}>
            <Avatar
              src={user.avatarUrl}
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              {user.displayName.substring(0, 2).toUpperCase()}
            </Avatar>
          </IconButton>
        )}
      </Box>

      {/* Notifications Menu Popover */}
      <AnyMenu
        anchorEl={notiAnchor}
        open={Boolean(notiAnchor)}
        onClose={handleNotiClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 320,
            mt: 1.5,
            p: 1.5,
            background: 'rgba(13, 14, 18, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.8)',
          },
        } as any}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, pb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" variant="text" onClick={handleClearNoti} sx={{ p: 0, fontSize: '0.72rem', minWidth: 0 }}>
              Mark read
            </Button>
          )}
        </Box>
        <Divider sx={{ opacity: 0.1, mb: 1 }} />
        {notifications.map((n) => (
          <MenuItem
            key={n.id}
            onClick={handleNotiClose}
            sx={{
              borderRadius: 1.5,
              p: 1.2,
              mb: 0.5,
              whiteSpace: 'normal',
              alignItems: 'flex-start',
              bgcolor: n.unread ? 'rgba(124, 58, 237, 0.04)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: n.unread ? 600 : 500, color: n.unread ? '#FFFFFF' : 'text.primary', fontSize: '0.8rem' }}>
                  {n.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                  {n.time}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.72rem', lineHeight: 1.3 }}>
                {n.desc}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </AnyMenu>

      {/* User Profile Dropdown Menu */}
      <AnyMenu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 240,
            mt: 1.5,
            p: 1,
            background: 'rgba(13, 14, 18, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.8)',
          },
        } as any}
      >
        {user && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
              {user.displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontSize: '0.75rem' }}>
              {user.email}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {user.roles.map((role) => (
                <Badge
                  key={role}
                  badgeContent={role}
                  sx={{
                    '& .MuiBadge-badge': {
                      position: 'static',
                      transform: 'none',
                      bgcolor: 'rgba(124, 58, 237, 0.15)',
                      color: 'primary.light',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      height: 18,
                      px: 0.8,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        <Divider sx={{ opacity: 0.1, my: 0.5 }} />
        <MenuItem onClick={() => { handleProfileClose(); navigate('/settings'); }} sx={{ borderRadius: 1.5, py: 1 }}>
          <ProfileIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          <Typography variant="body2">My Profile</Typography>
        </MenuItem>
        <MenuItem onClick={() => { handleProfileClose(); navigate('/settings'); }} sx={{ borderRadius: 1.5, py: 1 }}>
          <SettingsIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        <Divider sx={{ opacity: 0.1, my: 0.5 }} />
        <MenuItem onClick={handleLogoutClick} sx={{ borderRadius: 1.5, py: 1, color: 'error.light', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' } }}>
          <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: 'error.light' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Sign Out</Typography>
        </MenuItem>
      </AnyMenu>
    </Box>
  );
};

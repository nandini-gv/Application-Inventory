import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  FolderOpen as FolderIcon,
  AddCircleOutlined as AddIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { ApplicationService } from '../shared/services/ApplicationService';
import type { Application } from '../shared/types';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: 'Pages' | 'Applications' | 'Actions';
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
  external?: boolean;
  matchFields?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [apps, setApps] = useState<Application[]>([]);
  const navigate = useNavigate();

  // Load applications dynamically when opened
  useEffect(() => {
    if (open) {
      ApplicationService.getApplications().then(setApps).catch(err => {
        console.error('Failed to load apps for search:', err);
      });
    }
  }, [open]);

  // Static navigation pages & actions
  const staticItems: SearchItem[] = [
    { id: 'dash', title: 'Go to Dashboard', category: 'Pages', icon: <DashboardIcon />, path: '/dashboard' },
    { id: 'dir', title: 'Open Application Inventory', category: 'Pages', icon: <FolderIcon />, path: '/applications' },
    { id: 'reg', title: 'Register New Application', category: 'Pages', icon: <AddIcon />, path: '/register' },
    { id: 'anal', title: 'View Enterprise Insights', category: 'Pages', icon: <AnalyticsIcon />, path: '/insights' },
    { id: 'sett', title: 'Open Portal Settings', category: 'Pages', icon: <SettingsIcon />, path: '/settings' },
    
    // Actions
    { id: 'act2', title: 'Clear Cache & Reload Portal', category: 'Actions', icon: <SettingsIcon color="error" />, action: () => {
      localStorage.clear();
      window.location.reload();
    } },
  ];

  // Map inventory applications to SearchItems
  const appSearchItems: SearchItem[] = apps.map(app => ({
    id: app.id,
    title: `${app.name} (${app.appId})`,
    category: 'Applications',
    icon: <FolderIcon color="secondary" />,
    path: `/applications/${app.id}`,
    matchFields: [
      app.name,
      app.appId,
      app.owner.businessUnits.join(' '),
      app.owner.businessOwner,
      app.owner.technicalOwner,
      app.documents.repositoryUrl || '',
      ...app.technology.frontend,
      ...app.technology.backend,
      ...app.technology.middleware,
      ...app.technology.authentication,
      ...app.technology.messaging,
      ...app.technology.cache,
      ...app.technology.monitoring,
      ...app.technology.other,
      ...Object.values(app.environments).map(e => e.serverUrl || ''),
      ...Object.values(app.environments).map(e => e.serverIp || ''),
      app.status
    ].join(' ').toLowerCase()
  }));

  const allItems = [...staticItems, ...appSearchItems];

  // Filter items based on query
  const filteredItems = allItems.filter(item => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    
    if (item.category === 'Applications' && item.matchFields) {
      return item.matchFields.includes(q);
    }
    return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const handleItemClick = (item: SearchItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.path) {
      if (item.external) {
        window.open(item.path, '_blank', 'noopener,noreferrer');
      } else {
        navigate(item.path);
      }
    }
  };

  const AnyDialog = Dialog as any;
  const AnyTextField = TextField as any;

  return (
    <AnyDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      } as any}
    >
      <DialogContent sx={{ p: 2, bgcolor: 'rgba(13, 14, 18, 0.95)' }}>
        <AnyTextField
          autoFocus
          fullWidth
          placeholder="Search apps by name, BU, owner, stack, status, repo... (Esc to close)"
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip
                  label="ESC"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    color: 'text.secondary',
                    borderRadius: 1,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                  }}
                />
              </InputAdornment>
            ),
          } as any}
        />

        <Box sx={{ maxHeight: 350, overflowY: 'auto', pr: 1 }}>
          {filteredItems.length === 0 ? (
            <Box sx={{ py: 6, textAlignment: 'center', opacity: 0.5 }}>
              <Typography variant="body2" align="center" color="text.secondary">
                No matching applications or pages found.
              </Typography>
            </Box>
          ) : (
            Object.entries(
              filteredItems.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              }, {} as Record<string, SearchItem[]>)
            ).map(([category, items]) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="primary.light"
                  sx={{
                    px: 1.5,
                    pb: 0.5,
                    display: 'block',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {category}
                </Typography>
                <List dense sx={{ p: 0 }}>
                  {items.map((item) => (
                    <ListItemButton
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      sx={{
                        borderRadius: 1.5,
                        my: 0.5,
                        px: 1.5,
                        py: 1,
                        bgcolor: 'transparent',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.04)',
                          '& .item-icon': { color: 'primary.light' },
                          '& .item-action': { opacity: 1 },
                        },
                      }}
                    >
                      <ListItemIcon
                        className="item-icon"
                        sx={{
                          minWidth: 36,
                          color: 'text.secondary',
                          transition: 'color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { fontSize: 20 },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        {...{
                          primaryTypographyProps: {
                            variant: 'body2',
                            fontWeight: 500,
                            color: 'text.primary',
                          }
                        } as any}
                      />
                      {item.external && (
                        <Chip
                          label="External"
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.6rem', mr: 1 }}
                        />
                      )}
                      <Typography
                        className="item-action"
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '0.7rem',
                        }}
                      >
                        Select <span style={{ marginLeft: 4 }}>↵</span>
                      </Typography>
                    </ListItemButton>
                  ))}
                </List>
                <Divider sx={{ mt: 1.5, opacity: 0.3 }} />
              </Box>
            ))
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 1.5,
            px: 1,
            color: 'text.disabled',
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            Use ↑↓ to navigate, Enter to select
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 0.2 }}>
              <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 4px', borderRadius: 4 }}>⌘K</kbd> / <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 4px', borderRadius: 4 }}>Ctrl+K</kbd> to search
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </AnyDialog>
  );
};

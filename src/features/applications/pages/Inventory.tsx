import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Chip,
  IconButton,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  GridView as CardViewIcon,
  List as TableViewIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import { GlassCard } from '../../../components/GlassCard';
import { ApplicationService } from '../../../shared/services/ApplicationService';
import { MASTER_DATA } from '../../../shared/config/masterData';
import type { Application } from '../../../shared/types';

export const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Layout & Filter states
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Filters state
  const [filterBu, setFilterBu] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterHosting, setFilterHosting] = useState<string>('ALL');
  const [filterDeployment, setFilterDeployment] = useState<string>('ALL');
  const [filterTelemetry, setFilterTelemetry] = useState<string>('ALL');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    ApplicationService.getApplications()
      .then((data) => {
        setApps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load applications list:', err);
        setLoading(false);
      });
  }, []);

  const handleResetFilters = () => {
    setFilterBu('ALL');
    setFilterStatus('ALL');
    setFilterHosting('ALL');
    setFilterDeployment('ALL');
    setFilterTelemetry('ALL');
  };

  // Advanced Global Search and Multi-column filtering matching logic
  const filteredApps = apps.filter((app) => {
    // 1. Dropdown Filters check
    if (filterBu !== 'ALL' && !app.owner.businessUnits.includes(filterBu)) return false;
    if (filterStatus !== 'ALL' && app.status !== filterStatus) return false;
    if (filterHosting !== 'ALL' && app.hostingType !== filterHosting) return false;
    if (filterDeployment !== 'ALL' && app.deploymentMethod !== filterDeployment) return false;
    if (filterTelemetry !== 'ALL') {
      const wantsTelemetry = filterTelemetry === 'ENABLED';
      if (app.telemetry.telemetryEnabled !== wantsTelemetry) return false;
    }

    // 2. Global Search matches: Name, Owner, Repo, BU, Environment servers, Tech
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    const matchesName = app.name.toLowerCase().includes(query) || app.appId.toLowerCase().includes(query);
    const matchesOwner = app.owner.businessOwner.toLowerCase().includes(query) || app.owner.technicalOwner.toLowerCase().includes(query);
    const matchesBu = app.owner.businessUnits.some((b) => b.toLowerCase().includes(query));
    const matchesRepo = app.documents.repositoryUrl?.toLowerCase().includes(query);

    const techString = [
      ...app.technology.frontend,
      ...app.technology.backend,
      ...app.technology.middleware,
      ...app.technology.authentication,
      ...app.technology.messaging,
      ...app.technology.cache,
      ...app.technology.monitoring,
      ...app.technology.other,
    ].join(' ').toLowerCase();
    const matchesTech = techString.includes(query);

    const matchesEnvServer = Object.values(app.environments).some((env) => {
      return (
        env.serverUrl?.toLowerCase().includes(query) ||
        env.serverIp?.toLowerCase().includes(query) ||
        env.uiUrl?.toLowerCase().includes(query) ||
        env.backendUrl?.toLowerCase().includes(query)
      );
    });

    return matchesName || matchesOwner || matchesBu || matchesRepo || matchesTech || matchesEnvServer;
  });

  const exportToCSV = () => {
    const headers = [
      'Application Name',
      'Business Unit',
      'Business Owner',
      'Technical Owner',
      'Hosting Type',
      'Deployment Method',
      'Version',
      'Status',
      'Telemetry Enabled',
      'Last Updated',
    ];
    
    const rows = filteredApps.map((a) => [
      a.name,
      a.owner.businessUnits.join('; '),
      a.owner.businessOwner,
      a.owner.technicalOwner,
      a.hostingType,
      a.deploymentMethod,
      a.version,
      a.status,
      a.telemetry.telemetryEnabled ? 'Yes' : 'No',
      a.lastUpdated,
    ]);

    const content = [headers, ...rows]
      .map((r) => r.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `application_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'error';
      case 'Development': return 'warning';
      case 'Deprecated': return 'warning';
      default: return 'default';
    }
  };

  // Pagination slicing
  const paginatedApps = filteredApps.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const AnyTextField = TextField as any;
  const AnyFormControl = FormControl as any;
  const AnyButton = Button as any;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', color: '#FFFFFF', mb: 1 }}>
            Application Inventory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Query, manage, and audit corporate application registries and environments config targets.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <AnyButton variant="outlined" startIcon={<ExportIcon />} onClick={exportToCSV} sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            Export CSV
          </AnyButton>
          <AnyButton variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/register')}>
            Register App
          </AnyButton>
        </Box>
      </Box>

      {/* Query Filter row */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <AnyTextField
          placeholder="Search by application, owners, repository, technologies, server hostnames..."
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        <ButtonGroup variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <IconButton onClick={() => setViewMode('card')} color={viewMode === 'card' ? 'primary' : 'default'} sx={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardViewIcon />
          </IconButton>
          <IconButton onClick={() => setViewMode('table')} color={viewMode === 'table' ? 'primary' : 'default'} sx={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <TableViewIcon />
          </IconButton>
        </ButtonGroup>

        <AnyButton variant="outlined" startIcon={<FilterIcon />} onClick={() => setFilterOpen(true)} sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          Filters {(filterBu !== 'ALL' || filterStatus !== 'ALL' || filterHosting !== 'ALL' || filterDeployment !== 'ALL' || filterTelemetry !== 'ALL') ? '(Active)' : ''}
        </AnyButton>
      </Box>

      {/* Inventory Catalog layout */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <Typography color="text.secondary">Loading inventory registries...</Typography>
        </Box>
      ) : viewMode === 'card' ? (
        <Grid container spacing={3}>
          {paginatedApps.map((app) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={app.id}>
              <GlassCard
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)', borderColor: 'rgba(255,255,255,0.1)' },
                }}
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                    {app.name}
                  </Typography>
                  <Chip label={app.status} size="small" color={getStatusColor(app.status)} variant="outlined" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {app.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                  {app.owner.businessUnits.map((bu) => (
                    <Chip key={bu} label={bu} size="small" variant="outlined" />
                  ))}
                </Box>
                <Divider sx={{ opacity: 0.05, mb: 2 }} />
                <Grid container spacing={1}>
                  <Grid size={6}>
                    <Typography variant="caption" color="text.disabled">TECH OWNER</Typography>
                    <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.owner.technicalOwner || 'None'}</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="caption" color="text.disabled">HOSTING</Typography>
                    <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.hostingType}</Typography>
                  </Grid>
                </Grid>
              </GlassCard>
            </Grid>
          ))}
          {filteredApps.length === 0 && (
            <Grid size={12}>
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography color="text.secondary">No applications match the search/filter parameters.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: 'rgba(13, 14, 18, 0.4)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ borderBottom: '1.5px solid rgba(255,255,255,0.08)' }}>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Application Name</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Business Unit</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Business Owner</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Technical Owner</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Hosting</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Deployment</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Version</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Telemetry</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Last Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedApps.map((app) => (
                <TableRow
                  key={app.id}
                  hover
                  onClick={() => navigate(`/applications/${app.id}`)}
                  sx={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 600 }}>{app.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{app.owner.businessUnits.join(', ')}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{app.owner.businessOwner}</TableCell>
                  <TableCell sx={{ color: app.owner.technicalOwner ? 'text.secondary' : 'error.light', fontWeight: app.owner.technicalOwner ? 400 : 700 }}>
                    {app.owner.technicalOwner || 'Missing!'}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{app.hostingType}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{app.deploymentMethod}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>v{app.version}</TableCell>
                  <TableCell>
                    <Chip label={app.status} size="small" color={getStatusColor(app.status)} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={app.telemetry.telemetryEnabled ? 'Enabled' : 'Disabled'}
                      size="small"
                      color={app.telemetry.telemetryEnabled ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
                    {new Date(app.lastUpdated).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {filteredApps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No applications match the search/filter parameters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Table Pagination */}
      <TablePagination
        component="div"
        count={filteredApps.length}
        page={page}
        onPageChange={(_e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{
          color: 'text.secondary',
          '& .MuiTablePagination-selectIcon': { color: 'text.secondary' },
          '& .MuiTablePagination-actions button': { color: 'text.secondary' },
        }}
      />

      {/* Advanced Filters Drawer */}
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              bgcolor: '#0D0E12',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            },
          },
        }}
      >
        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
          Filter Options
        </Typography>

        <AnyFormControl fullWidth>
          <InputLabel id="drawer-bu-label">Business Unit</InputLabel>
          <Select
            labelId="drawer-bu-label"
            label="Business Unit"
            value={filterBu}
            onChange={(e: any) => setFilterBu(e.target.value)}
          >
            <MenuItem value="ALL">All Business Units</MenuItem>
            {MASTER_DATA.BUSINESS_UNITS.map((bu) => (
              <MenuItem key={bu} value={bu}>{bu}</MenuItem>
            ))}
          </Select>
        </AnyFormControl>

        <AnyFormControl fullWidth>
          <InputLabel id="drawer-status-label">Lifecycle Status</InputLabel>
          <Select
            labelId="drawer-status-label"
            label="Lifecycle Status"
            value={filterStatus}
            onChange={(e: any) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            {MASTER_DATA.APPLICATION_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </AnyFormControl>

        <AnyFormControl fullWidth>
          <InputLabel id="drawer-host-label">Hosting Type</InputLabel>
          <Select
            labelId="drawer-host-label"
            label="Hosting Type"
            value={filterHosting}
            onChange={(e: any) => setFilterHosting(e.target.value)}
          >
            <MenuItem value="ALL">All Hosting Models</MenuItem>
            {MASTER_DATA.HOSTING_TYPES.map((h) => (
              <MenuItem key={h} value={h}>{h}</MenuItem>
            ))}
          </Select>
        </AnyFormControl>

        <AnyFormControl fullWidth>
          <InputLabel id="drawer-deploy-label">Deployment Method</InputLabel>
          <Select
            labelId="drawer-deploy-label"
            label="Deployment Method"
            value={filterDeployment}
            onChange={(e: any) => setFilterDeployment(e.target.value)}
          >
            <MenuItem value="ALL">All Methods</MenuItem>
            {MASTER_DATA.DEPLOYMENT_METHODS.map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </Select>
        </AnyFormControl>

        <AnyFormControl fullWidth>
          <InputLabel id="drawer-telemetry-label">Telemetry Status</InputLabel>
          <Select
            labelId="drawer-telemetry-label"
            label="Telemetry Status"
            value={filterTelemetry}
            onChange={(e: any) => setFilterTelemetry(e.target.value)}
          >
            <MenuItem value="ALL">All Telemetry States</MenuItem>
            <MenuItem value="ENABLED">Telemetry Enabled</MenuItem>
            <MenuItem value="DISABLED">Telemetry Disabled</MenuItem>
          </Select>
        </AnyFormControl>

        <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
          <AnyButton variant="outlined" fullWidth onClick={handleResetFilters}>
            Reset
          </AnyButton>
          <AnyButton variant="contained" fullWidth onClick={() => setFilterOpen(false)}>
            Apply
          </AnyButton>
        </Box>
      </Drawer>
    </Box>
  );
};

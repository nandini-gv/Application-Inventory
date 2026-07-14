import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Button, Avatar, IconButton } from '@mui/material';
import {
  FolderOpenOutlined as AppsIcon,

  DescriptionOutlined as DocIcon,
  CodeOutlined as RepoIcon,
  DnsOutlined as ServerIcon,
  PersonPinOutlined as OwnerIcon,
  Speed as TelemetryIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { GlassCard } from '../../../components/GlassCard';
import { ApplicationService } from '../../../shared/services/ApplicationService';
import type { Application } from '../../../shared/types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApplicationService.getApplications()
      .then((data) => {
        setApps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard statistics:', err);
        setLoading(false);
      });
  }, []);

  // Compute statistics
  const totalApps = apps.length;

  const distinctBUs = Array.from(
    new Set(apps.flatMap((app) => app.owner.businessUnits))
  ).filter(Boolean);

  const telemetryCount = apps.filter((app) => app.telemetry.telemetryEnabled).length;

  const missingDocsCount = apps.filter(
    (app) => !app.documents.confluenceUrl || !app.documents.runbookUrl
  ).length;

  const missingRepoCount = apps.filter((app) => !app.documents.repositoryUrl).length;

  const missingServerCount = apps.filter((app) => !app.environments.PROD?.serverUrl).length;

  const missingTechOwnerCount = apps.filter((app) => !app.owner.technicalOwner).length;

  // Chart Data calculations
  // 1. Apps by Business Unit
  const buCounts: Record<string, number> = {};
  apps.flatMap(a => a.owner.businessUnits).forEach(bu => {
    buCounts[bu] = (buCounts[bu] || 0) + 1;
  });
  const sortedBUs = Object.entries(buCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 2. Apps by Hosting Type
  const hostCounts: Record<string, number> = { 'Cloud': 0, 'On Premises': 0, 'Hybrid': 0 };
  apps.forEach(a => {
    if (a.hostingType) {
      hostCounts[a.hostingType] = (hostCounts[a.hostingType] || 0) + 1;
    }
  });

  // 3. Apps by Stack (Top Stacks)
  const techCounts: Record<string, number> = {};
  apps.forEach(a => {
    const stacks = [
      ...a.technology.frontend,
      ...a.technology.backend,
    ];
    stacks.forEach(s => {
      techCounts[s] = (techCounts[s] || 0) + 1;
    });
  });
  const sortedStacks = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Recently Added
  const recentApps = [...apps]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5);

  const AnyButton = Button as any;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', color: '#FFFFFF', mb: 1 }}>
            Registry Command Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enterprise Application Inventory and Metadata Compliance overview.
          </Typography>
        </Box>
        <AnyButton variant="contained" onClick={() => navigate('/register')}>
          Register Application
        </AnyButton>
      </Box>

      {loading ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography color="text.secondary">Recalculating metadata metrics...</Typography>
        </Box>
      ) : (
        <>
          {/* Stats Grid */}
          <Grid container spacing={3.5}>
            {/* Total Apps */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <GlassCard sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar sx={{ bgcolor: 'rgba(124,58,237,0.12)', color: 'primary.light' }}>
                  <AppsIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Apps
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>{totalApps}</Typography>
                </Box>
              </GlassCard>
            </Grid>

            {/* Business Units count */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <GlassCard sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar sx={{ bgcolor: 'rgba(6,182,212,0.12)', color: 'secondary.light' }}>
                  <OwnerIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    Active BUs
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>{distinctBUs.length}</Typography>
                </Box>
              </GlassCard>
            </Grid>

            {/* Telemetry Enabled */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <GlassCard sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar sx={{ bgcolor: 'rgba(34,211,238,0.12)', color: 'secondary.main' }}>
                  <TelemetryIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    Telemetry On
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>{telemetryCount}</Typography>
                </Box>
              </GlassCard>
            </Grid>

            {/* Missing Owners */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <GlassCard sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                  <OwnerIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    No Tech Owner
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#EF4444' }}>{missingTechOwnerCount}</Typography>
                </Box>
              </GlassCard>
            </Grid>

            {/* Compliance Stats Cards */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <GlassCard sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5, border: '1px solid rgba(239, 68, 68, 0.15)', bgcolor: 'rgba(239, 68, 68, 0.01)' }}>
                <Avatar sx={{ bgcolor: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                  <DocIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    Missing Docs
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>{missingDocsCount}</Typography>
                </Box>
              </GlassCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <GlassCard sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5, border: '1px solid rgba(239, 68, 68, 0.15)', bgcolor: 'rgba(239, 68, 68, 0.01)' }}>
                <Avatar sx={{ bgcolor: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                  <RepoIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    Missing Repositories
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>{missingRepoCount}</Typography>
                </Box>
              </GlassCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <GlassCard sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5, border: '1px solid rgba(239, 68, 68, 0.15)', bgcolor: 'rgba(239, 68, 68, 0.01)' }}>
                <Avatar sx={{ bgcolor: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                  <ServerIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    Missing Server URLs
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>{missingServerCount}</Typography>
                </Box>
              </GlassCard>
            </Grid>
          </Grid>

          {/* Graphs and feeds */}
          <Grid container spacing={4}>
            {/* Apps by BU SVG horizontal bar chart */}
            <Grid size={{ xs: 12, md: 6 }}>
              <GlassCard sx={{ p: 4, height: '100%' }}>
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
                  Applications by Business Unit
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {sortedBUs.map(([bu, count]) => {
                    const pct = totalApps > 0 ? (count / totalApps) * 100 : 0;
                    return (
                      <Box key={bu}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF' }}>{bu}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>{count} Apps</Typography>
                        </Box>
                        {/* Custom SVG Bar */}
                        <svg width="100%" height="8" style={{ display: 'block', borderRadius: 4 }}>
                          <rect width="100%" height="8" fill="rgba(255,255,255,0.05)" />
                          <rect width={`${pct}%`} height="8" fill="url(#violet-grad)" rx="4" />
                          <defs>
                            <linearGradient id="violet-grad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#7C3AED" />
                              <stop offset="100%" stopColor="#A78BFA" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </Box>
                    );
                  })}
                </Box>
              </GlassCard>
            </Grid>

            {/* Apps by Hosting splits SVG donut / pie indicator */}
            <Grid size={{ xs: 12, md: 6 }}>
              <GlassCard sx={{ p: 4, height: '100%' }}>
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
                  Applications by Hosting Type
                </Typography>
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                  <Grid size={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    {/* SVG Donut */}
                    <svg width="140" height="140" viewBox="0 0 42 42" className="donut">
                      <circle className="donut-hole" cx="21" cy="21" r="15.915" fill="transparent" />
                      <circle className="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="4.2" />
                      
                      {/* Segment 1: Cloud */}
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke="#06B6D4"
                        strokeWidth="4.2"
                        strokeDasharray={`${totalApps > 0 ? (hostCounts.Cloud / totalApps) * 100 : 0} ${100 - (totalApps > 0 ? (hostCounts.Cloud / totalApps) * 100 : 0)}`}
                        strokeDashoffset="25"
                      />
                    </svg>
                  </Grid>
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#06B6D4' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">Cloud</Typography>
                          <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 700 }}>{hostCounts.Cloud} Apps</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">On Premises</Typography>
                          <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 700 }}>{hostCounts['On Premises']} Apps</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#7C3AED' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">Hybrid</Typography>
                          <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 700 }}>{hostCounts.Hybrid} Apps</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </GlassCard>
            </Grid>

            {/* Apps by Top Stack Stacks */}
            <Grid size={{ xs: 12, md: 6 }}>
              <GlassCard sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
                  Applications by Technology Stacks
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {sortedStacks.map(([tech, count]) => {
                    const pct = totalApps > 0 ? (count / totalApps) * 100 : 0;
                    return (
                      <Box key={tech}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF' }}>{tech}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>{count} Apps</Typography>
                        </Box>
                        <svg width="100%" height="8" style={{ display: 'block', borderRadius: 4 }}>
                          <rect width="100%" height="8" fill="rgba(255,255,255,0.05)" />
                          <rect width={`${pct}%`} height="8" fill="#06B6D4" rx="4" />
                        </svg>
                      </Box>
                    );
                  })}
                </Box>
              </GlassCard>
            </Grid>

            {/* Recently Registered applications list */}
            <Grid size={{ xs: 12, md: 6 }}>
              <GlassCard sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
                  Recently Added Applications
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                  {recentApps.map((a) => (
                    <Box
                      key={a.id}
                      onClick={() => navigate(`/applications/${a.id}`)}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' },
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                          {a.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          AppID: <b>{a.appId}</b> • {a.owner.businessUnits.join(', ')}
                        </Typography>
                      </Box>
                      <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <ArrowIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </GlassCard>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

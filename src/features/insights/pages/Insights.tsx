import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, LinearProgress, CircularProgress } from '@mui/material';
import { GlassCard } from '../../../components/GlassCard';
import { ApplicationService } from '../../../shared/services/ApplicationService';
import type { Application } from '../../../shared/types';

export const Insights: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApplicationService.getApplications()
      .then((data) => {
        setApps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load insights statistics:', err);
        setLoading(false);
      });
  }, []);

  const total = apps.length;

  // 1. Business Units
  const buCounts: Record<string, number> = {};
  apps.flatMap((a) => a.owner.businessUnits).forEach((bu) => {
    buCounts[bu] = (buCounts[bu] || 0) + 1;
  });
  const sortedBUs = Object.entries(buCounts).sort((a, b) => b[1] - a[1]);

  // 2. Tech Stack
  const techCounts: Record<string, number> = {};
  apps.forEach((a) => {
    const stacks = [
      ...a.technology.frontend,
      ...a.technology.backend,
    ];
    stacks.forEach((s) => {
      techCounts[s] = (techCounts[s] || 0) + 1;
    });
  });
  const sortedTech = Object.entries(techCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // 3. Hosting Type
  const hostingCounts: Record<string, number> = {};
  apps.forEach((a) => {
    hostingCounts[a.hostingType] = (hostingCounts[a.hostingType] || 0) + 1;
  });
  const sortedHosting = Object.entries(hostingCounts).sort((a, b) => b[1] - a[1]);

  // 4. Deployment Method
  const deployCounts: Record<string, number> = {};
  apps.forEach((a) => {
    deployCounts[a.deploymentMethod] = (deployCounts[a.deploymentMethod] || 0) + 1;
  });
  const sortedDeploy = Object.entries(deployCounts).sort((a, b) => b[1] - a[1]);

  // 5. Lifecycles
  const lifecycleCounts: Record<string, number> = { Active: 0, Inactive: 0, Development: 0, Deprecated: 0 };
  apps.forEach((a) => {
    lifecycleCounts[a.status] = (lifecycleCounts[a.status] || 0) + 1;
  });

  // 6. Compliance ratios
  const missingRepo = apps.filter((a) => !a.documents.repositoryUrl).length;
  const missingDocs = apps.filter((a) => !a.documents.confluenceUrl || !a.documents.runbookUrl).length;
  const missingOwner = apps.filter((a) => !a.owner.technicalOwner).length;
  const telemetryEnabled = apps.filter((a) => a.telemetry.telemetryEnabled).length;

  const pctRepo = total > 0 ? ((total - missingRepo) / total) * 100 : 0;
  const pctDocs = total > 0 ? ((total - missingDocs) / total) * 100 : 0;
  const pctOwner = total > 0 ? ((total - missingOwner) / total) * 100 : 0;
  const pctTele = total > 0 ? (telemetryEnabled / total) * 100 : 0;

  const renderHorizontalBar = (label: string, count: number, max: number, colorGrad = 'linear-gradient(90deg, #7C3AED, #A78BFA)') => {
    const pct = max > 0 ? (count / max) * 100 : 0;
    return (
      <Box sx={{ mb: 2.5 }} key={label}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF' }}>{label}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>{count} Apps</Typography>
        </Box>
        <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ width: `${pct}%`, height: '100%', background: colorGrad, borderRadius: 3 }} />
        </Box>
      </Box>
    );
  };

  const renderComplianceGauge = (title: string, value: number, color = '#06B6D4') => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={value}
            size={70}
            thickness={4.5}
            sx={{
              color: color,
              '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
              {Math.round(value)}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" align="center" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
          {title}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography color="text.secondary">Evaluating registry audit metrics...</Typography>
      </Box>
    );
  }

  const maxBUCount = sortedBUs.length > 0 ? sortedBUs[0][1] : 0;
  const maxTechCount = sortedTech.length > 0 ? sortedTech[0][1] : 0;
  const maxHostingCount = sortedHosting.length > 0 ? sortedHosting[0][1] : 0;
  const maxDeployCount = sortedDeploy.length > 0 ? sortedDeploy[0][1] : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', color: '#FFFFFF', mb: 1 }}>
          Business Insights
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze technical alignment split, compliance quality metrics, and infrastructure host profiles.
        </Typography>
      </Box>

      {/* Compliance Quality Row */}
      <Grid container spacing={3.5}>
        <Grid size={12}>
          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
              Metadata Compliance & Quality Ratios
            </Typography>
            <Grid container spacing={4} sx={{ justifyContent: 'space-around' }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                {renderComplianceGauge('Repository Attached', pctRepo, '#06B6D4')}
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                {renderComplianceGauge('Runbook / Confluence Docs', pctDocs, '#22D3EE')}
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                {renderComplianceGauge('Technical Lead Appointed', pctOwner, '#7C3AED')}
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                {renderComplianceGauge('Active Telemetry logs', pctTele, '#10B981')}
              </Grid>
            </Grid>
          </GlassCard>
        </Grid>

        {/* BUs and Tech Splits */}
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
              Applications per Business Unit
            </Typography>
            <Box>
              {sortedBUs.map(([bu, count]) =>
                renderHorizontalBar(bu, count, maxBUCount, 'linear-gradient(90deg, #7C3AED, #A78BFA)')
              )}
            </Box>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
              Applications per Technology Stack (Top 5)
            </Typography>
            <Box>
              {sortedTech.map(([tech, count]) =>
                renderHorizontalBar(tech, count, maxTechCount, 'linear-gradient(90deg, #06B6D4, #22D3EE)')
              )}
            </Box>
          </GlassCard>
        </Grid>

        {/* Hosting models and deployment methods */}
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
              Applications per Hosting Type
            </Typography>
            <Box>
              {sortedHosting.map(([host, count]) =>
                renderHorizontalBar(host, count, maxHostingCount, 'linear-gradient(90deg, #F59E0B, #FBBF24)')
              )}
            </Box>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
              Applications per Deployment Method
            </Typography>
            <Box>
              {sortedDeploy.map(([deploy, count]) =>
                renderHorizontalBar(deploy, count, maxDeployCount, 'linear-gradient(90deg, #10B981, #34D399)')
              )}
            </Box>
          </GlassCard>
        </Grid>

        {/* Lifecycles progress metrics */}
        <Grid size={12}>
          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3.5 }}>
              Application Lifecycle Distributions
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(lifecycleCounts).map(([status, count]) => {
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <Grid size={{ xs: 6, sm: 3 }} key={status}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                        {status}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>{count}</Typography>
                        <Typography variant="caption" color="primary.light" sx={{ fontWeight: 700 }}>{Math.round(pct)}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={pct} color={status === 'Active' ? 'success' : status === 'Inactive' ? 'error' : 'warning'} sx={{ height: 4, borderRadius: 2 }} />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

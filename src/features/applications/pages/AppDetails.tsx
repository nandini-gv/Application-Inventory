import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  Link,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ExpandMore as ExpandMoreIcon,
  FolderOpenOutlined as AppsIcon,
  PersonPinOutlined as OwnerIcon,
  CodeOutlined as TechIcon,
  DnsOutlined as EnvIcon,
  DescriptionOutlined as DocIcon,
  Speed as TelemetryIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';

import { ApplicationService } from '../../../shared/services/ApplicationService';
import { EnvironmentCard } from '../components/EnvironmentCard';
import { MASTER_DATA } from '../../../shared/config/masterData';
import type { Application } from '../../../shared/types';

export const AppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [envTab, setEnvTab] = useState(0);

  // Reusable form provider instance to support EnvironmentCard contexts
  const methods = useForm();

  useEffect(() => {
    if (id) {
      ApplicationService.getApplicationById(id)
        .then((data) => {
          setApp(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load application details:', err);
          setLoading(false);
        });
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'error';
      case 'Development': return 'warning';
      case 'Deprecated': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!app) {
    return (
      <Box sx={{ py: 6 }}>
        <Alert severity="error" variant="outlined">
          Application with ID "{id}" was not found.
        </Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/applications')} sx={{ mt: 2 }}>
          Back to Inventory
        </Button>
      </Box>
    );
  }

  const renderChipsList = (label: string, items?: string[]) => {
    if (!items || items.length === 0) return null;
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontWeight: 700, mb: 1, textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {items.map((it) => (
            <Chip key={it} label={it} size="small" variant="outlined" sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }} />
          ))}
        </Box>
      </Box>
    );
  };

  const renderDocLink = (label: string, url?: string) => {
    return (
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase', mb: 0.5 }}>
          {label}
        </Typography>
        {url ? (
          <Button
            size="small"
            variant="text"
            color="secondary"
            href={url}
            target="_blank"
            endIcon={<LaunchIcon sx={{ fontSize: 12 }} />}
            sx={{ p: 0, textTransform: 'none', minWidth: 0, '&:hover': { textDecoration: 'underline' } }}
          >
            {url}
          </Button>
        ) : (
          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
            Not Configured
          </Typography>
        )}
      </Grid>
    );
  };

  const accordionStyle = {
    background: 'rgba(13, 14, 18, 0.4)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px !important',
    mb: 2,
    boxShadow: 'none',
    '&:before': { display: 'none' },
  };

  const summaryStyle = {
    color: '#FFFFFF',
    fontWeight: 700,
    '& .MuiAccordionSummary-content': { display: 'flex', alignItems: 'center', gap: 1.8 },
  };

  const AnyButton = Button as any;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header */}
      <Box>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/applications')} sx={{ mb: 2, color: 'text.secondary' }}>
          Back to Inventory
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', color: '#FFFFFF', mb: 1 }}>
              {app.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ID: <b>{app.appId}</b> • Core Version: <b>v{app.version}</b>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Chip label={app.status} color={getStatusColor(app.status)} variant="outlined" sx={{ fontWeight: 700 }} />
            <Chip label={app.hostingType} color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
          </Box>
        </Box>
      </Box>

      {/* Accordion Views */}
      <Box>
        {/* 1. GENERAL */}
        <Accordion sx={accordionStyle} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />} sx={summaryStyle}>
            <AppsIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>General Information</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
                Application Description
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
                {app.description}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>APPLICATION ID</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'secondary.light', fontWeight: 600 }}>{app.appId}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>HOSTING TYPE</Typography>
                <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.hostingType}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>DEPLOYMENT METHOD</Typography>
                <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.deploymentMethod}</Typography>
              </Grid>
            </Grid>

            {app.deploymentMethod === 'Docker' && app.dockerDetails && (
              <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: 'rgba(124,58,237,0.03)', border: '1px solid rgba(124,58,237,0.12)' }}>
                <Typography variant="caption" color="primary.light" sx={{ display: 'block', fontWeight: 700, mb: 1.5, textTransform: 'uppercase' }}>
                  Docker Container Specifications
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>IMAGE NAME</Typography>
                    <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.dockerDetails.imageName}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>REGISTRY</Typography>
                    <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.dockerDetails.registry}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>CONTAINER NAME</Typography>
                    <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.dockerDetails.containerName}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>NAMESPACE</Typography>
                    <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.dockerDetails.namespace}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        {/* 2. OWNERSHIP */}
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />} sx={summaryStyle}>
            <OwnerIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Ownership & Support</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 4 }}>
            <Grid container spacing={3.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderChipsList('Associated Business Units', app.owner.businessUnits)}
                <Box sx={{ mb: 2, mt: 3 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontWeight: 700, mb: 0.5 }}>BUSINESS OWNER</Typography>
                  <Typography variant="body1" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.owner.businessOwner}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontWeight: 700, mb: 0.5 }}>TECHNICAL OWNER</Typography>
                  <Typography variant="body1" color={app.owner.technicalOwner ? '#FFFFFF' : 'error.light'} sx={{ fontWeight: 600 }}>
                    {app.owner.technicalOwner || 'Technical Owner Missing!'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="subtitle2" color="secondary.light" sx={{ fontWeight: 700, mb: 2 }}>Support Contacts</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>SUPPORT TEAM</Typography>
                  <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600, mb: 2 }}>{app.owner.supportTeam}</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>SUPPORT EMAIL</Typography>
                  <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600, mb: 2 }}>{app.owner.supportEmail}</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>SUPPORT CONTACT</Typography>
                  <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.owner.supportContact}</Typography>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 3. TECHNOLOGY */}
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />} sx={summaryStyle}>
            <TechIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Technology Stack</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>{renderChipsList('Frontend Stacks', app.technology.frontend)}</Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>{renderChipsList('Backend Stacks', app.technology.backend)}</Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>{renderChipsList('Middleware & API', app.technology.middleware)}</Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>{renderChipsList('Authentication', app.technology.authentication)}</Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>{renderChipsList('Messaging Brokers', app.technology.messaging)}</Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>{renderChipsList('Caching Layers', app.technology.cache)}</Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>{renderChipsList('Monitoring Tools', app.technology.monitoring)}</Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>{renderChipsList('Other Systems', app.technology.other)}</Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 4. ENVIRONMENT */}
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />} sx={summaryStyle}>
            <EnvIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Environments Nodes</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 4 }}>
            <FormProvider {...methods}>
              <Box>
                <Tabs
                  value={envTab}
                  onChange={(_e, val) => setEnvTab(val)}
                  sx={{
                    mb: 3,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    '& .MuiTabs-indicator': { bgcolor: 'primary.light' },
                    '& .MuiTab-root': {
                      color: 'text.secondary',
                      fontWeight: 600,
                      '&.Mui-selected': { color: 'primary.light' },
                    },
                  }}
                >
                  {MASTER_DATA.ENVIRONMENTS.map((env) => (
                    <Tab label={env} key={env} />
                  ))}
                </Tabs>
                <EnvironmentCard
                  envName={MASTER_DATA.ENVIRONMENTS[envTab]}
                  readOnly
                  data={app.environments[MASTER_DATA.ENVIRONMENTS[envTab]]}
                />
              </Box>
            </FormProvider>
          </AccordionDetails>
        </Accordion>

        {/* 5. DOCUMENTATION */}
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />} sx={summaryStyle}>
            <DocIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Documentation & Release URLs</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 4 }}>
            <Grid container spacing={3.5}>
              {renderDocLink('Repository URL', app.documents.repositoryUrl)}
              {renderDocLink('Confluence documentation', app.documents.confluenceUrl)}
              {renderDocLink('Teams Channel Link', app.documents.teamsChannelUrl)}
              {renderDocLink('Swagger Spec URL', app.documents.swaggerUrl)}
              {renderDocLink('Architecture Diagram link', app.documents.architectureDiagramUrl)}
              {renderDocLink('Operational Runbook URL', app.documents.runbookUrl)}
              {renderDocLink('Jenkins CI Server', app.documents.jenkinsUrl)}
              {renderDocLink('SonarQube Dashboard', app.documents.sonarQubeUrl)}
              {renderDocLink('Nexus Artifacts Repo', app.documents.nexusUrl)}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 6. TELEMETRY */}
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />} sx={summaryStyle}>
            <TelemetryIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>OpenSearch Active Telemetry</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 4 }}>
            {app.telemetry.telemetryEnabled ? (
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                      <Typography variant="subtitle1" color="#FFFFFF" sx={{ fontWeight: 700 }}>
                        Active Monitoring Statistics
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Telemetry streams configured under index: <b>{app.telemetry.opensearchIndex}</b>
                      </Typography>
                    </Box>
                    <Chip label="MONITORING ACTIVE" color="success" size="small" sx={{ fontWeight: 700 }} />
                  </Box>

                  <Grid container spacing={3.5} sx={{ mb: 4 }}>
                    <Grid size={4}>
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>AVAILABILITY</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: (app.telemetry.availability ?? 0) >= 99.9 ? 'success.main' : 'warning.main' }}>
                        {app.telemetry.availability}%
                      </Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>RESPONSE TIME</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>{app.telemetry.responseTime} ms</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>STATUS CHECK</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'success.light', mt: 0.8 }}>Heartbeat OK</Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ opacity: 0.08, mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>OpenSearch Service Name</Typography>
                      <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{app.telemetry.serviceName}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Health Check Target URL</Typography>
                      {app.telemetry.healthEndpoint ? (
                        <Link href={app.telemetry.healthEndpoint} target="_blank" sx={{ color: 'secondary.light', fontSize: '0.85rem' }}>{app.telemetry.healthEndpoint}</Link>
                      ) : (
                        <Typography variant="body2" color="text.disabled">Not Configured</Typography>
                      )}
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <AnyButton variant="contained" color="secondary" href={app.telemetry.opensearchDashboard} target="_blank" endIcon={<LaunchIcon sx={{ fontSize: 12 }} />}>
                      Open OpenSearch Dashboard
                    </AnyButton>
                    <AnyButton variant="outlined" href={app.telemetry.opensearchDashboard} target="_blank">
                      Open Logs Streams
                    </AnyButton>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 3, borderRadius: 2, border: '1px solid rgba(255,255,255,0.04)', bgcolor: 'rgba(255,255,255,0.015)' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Check Heartbeats</Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Last Heartbeat Received</Typography>
                    <Typography variant="body2" color="success.light" sx={{ fontWeight: 600, mb: 2 }}>{app.telemetry.lastHeartbeat || 'Just now'}</Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Monitoring Scope Target</Typography>
                    <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 600 }}>{app.telemetry.environment || 'PROD'}</Typography>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ py: 3, textAlign: 'center', opacity: 0.6 }}>
                <Typography variant="body2" color="text.secondary">
                  Telemetry is not configured for this application.
                </Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

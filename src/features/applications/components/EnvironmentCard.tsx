import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
  Check as CheckedIcon,
} from '@mui/icons-material';
import type { EnvironmentName } from '../../../shared/config/masterData';
import type { ApplicationFormValues } from '../schemas/applicationFormSchema';

interface EnvironmentCardProps {
  envName: EnvironmentName;
  readOnly?: boolean;
  data?: any; // Used when readOnly = true
}

export const EnvironmentCard: React.FC<EnvironmentCardProps> = ({
  envName,
  readOnly = false,
  data,
}) => {
  const { control, formState: { errors } } = useFormContext<ApplicationFormValues>();
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const AnyTextField = TextField as any;
  const AnyButton = Button as any;

  // READ-ONLY DISPLAY MODE (Details Page)
  if (readOnly) {
    const envData = data || {};
    const hasDetails = Object.values(envData).some(val => val !== undefined && val !== '');

    if (!hasDetails) {
      return (
        <Box sx={{ p: 3, border: '1px dashed rgba(255, 255, 255, 0.08)', borderRadius: 2, textAlign: 'center', opacity: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {envName} Environment is not configured for this application.
          </Typography>
        </Box>
      );
    }

    const renderReadOnlyRow = (label: string, value?: string, isLink = false) => {
      if (!value) return null;
      return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={label}>
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase', tracking: '0.05em', mb: 0.5 }}>
            {label}
          </Typography>
          {isLink ? (
            <AnyButton
              size="small"
              variant="text"
              color="secondary"
              href={value}
              target="_blank"
              endIcon={<LaunchIcon sx={{ fontSize: 12 }} />}
              sx={{ p: 0, textTransform: 'none', minWidth: 0, '&:hover': { textDecoration: 'underline' } }}
            >
              {value}
            </AnyButton>
          ) : (
            <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 500 }}>
              {value}
            </Typography>
          )}
        </Grid>
      );
    };

    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.06)',
          bgcolor: 'rgba(255, 255, 255, 0.01)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 3,
            height: '100%',
            bgcolor: envName === 'PROD' ? 'primary.main' : 'secondary.main',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 1 }}>
            {envName} Environment
          </Typography>
          {envName === 'PROD' && (
            <Typography variant="caption" sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: 'primary.light', border: '1px solid rgba(124,58,237,0.25)', px: 1, py: 0.3, borderRadius: 1, fontWeight: 700 }}>
              PRIMARY LIVE
            </Typography>
          )}
        </Box>

        <Grid container spacing={3.5}>
          {/* Highlight Server Details */}
          {envData.serverUrl && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(124, 58, 237, 0.04)',
                  border: '1px solid rgba(124, 58, 237, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="caption" color="primary.light" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase', tracking: '0.05em', mb: 0.5 }}>
                    Server Access Details
                  </Typography>
                  <Typography variant="body2" color="#FFFFFF" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {envData.serverUrl} {envData.serverIp ? `(${envData.serverIp})` : ''}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title={copiedField === 'server' ? 'Copied!' : 'Copy Server Address'}>
                    <IconButton size="small" onClick={() => handleCopy(`${envData.serverUrl} ${envData.serverIp || ''}`.trim(), 'server')} sx={{ color: 'text.secondary' }}>
                      {copiedField === 'server' ? <CheckedIcon fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ping / Open Server">
                    <IconButton size="small" href={`http://${envData.serverUrl}`} target="_blank" sx={{ color: 'text.secondary' }}>
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          )}

          {renderReadOnlyRow('UI Endpoint URL', envData.uiUrl, true)}
          {renderReadOnlyRow('Backend API URL', envData.backendUrl, true)}
          {renderReadOnlyRow('Database Instance', envData.databaseUrl)}
          {renderReadOnlyRow('IIS Application Pool', envData.appPool)}
          {renderReadOnlyRow('Docker Image Tag', envData.dockerImage)}
          {renderReadOnlyRow('Docker Registry', envData.dockerRegistry)}
          {renderReadOnlyRow('Docker Container Name', envData.containerName)}
          {renderReadOnlyRow('Config Repository', envData.repoUrl, true)}
          {renderReadOnlyRow('OpenSearch Logs', envData.opensearchDashboard, true)}
          {renderReadOnlyRow('Health Check Endpoint', envData.healthEndpoint, true)}
          {renderReadOnlyRow('Deployment Release Notes', envData.deploymentNotes)}
          {renderReadOnlyRow('Hardware Server Notes', envData.serverNotes)}
        </Grid>
      </Box>
    );
  }

  // WIZARD FORM EDIT MODE (Registration Form)
  const envErrors = errors.environments?.[envName];

  return (
    <Box
      sx={{
        p: 3.5,
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        bgcolor: 'rgba(255, 255, 255, 0.005)',
        mb: 3,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.light', mb: 3 }}>
        {envName} Configuration
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`environments.${envName}.uiUrl`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="UI Endpoint URL"
                placeholder="https://uat-app.enterprise.com"
                fullWidth
                error={Boolean(envErrors?.uiUrl)}
                helperText={envErrors?.uiUrl?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`environments.${envName}.backendUrl`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="Backend API URL"
                placeholder="https://uat-api.enterprise.com"
                fullWidth
                error={Boolean(envErrors?.backendUrl)}
                helperText={envErrors?.backendUrl?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`environments.${envName}.databaseUrl`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="Database Connection URL / Name"
                placeholder="e.g. postgres-prod-db-1"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`environments.${envName}.repoUrl`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="Environment Config Repository URL"
                placeholder="e.g. Git Repository link"
                fullWidth
                error={Boolean(envErrors?.repoUrl)}
                helperText={envErrors?.repoUrl?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`environments.${envName}.serverUrl`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="Server URL / Hostname"
                placeholder="e.g. prd-app-server-01.company.com"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`environments.${envName}.serverIp`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="Server IP Address"
                placeholder="e.g. 10.140.50.25"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Controller
            name={`environments.${envName}.appPool`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="IIS Application Pool"
                placeholder="e.g. sp-sync-pool"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Controller
            name={`environments.${envName}.dockerImage`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="Docker Image Tag"
                placeholder="e.g. sp-sync:v2.0.0"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Controller
            name={`environments.${envName}.dockerRegistry`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="Docker Registry Server"
                placeholder="e.g. registry.enterprise.com"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`environments.${envName}.opensearchDashboard`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="OpenSearch Dashboard Link"
                placeholder="OpenSearch logging URL"
                fullWidth
                error={Boolean(envErrors?.opensearchDashboard)}
                helperText={envErrors?.opensearchDashboard?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`environments.${envName}.healthEndpoint`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="Health check endpoint URL"
                placeholder="https://app.company.com/health"
                fullWidth
                error={Boolean(envErrors?.healthEndpoint)}
                helperText={envErrors?.healthEndpoint?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`environments.${envName}.deploymentNotes`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="Deployment / Release Notes"
                placeholder="Add special deployment instructions or commands..."
                multiline
                rows={2}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`environments.${envName}.serverNotes`}
            control={control}
            render={({ field }) => (
              <AnyTextField
                {...field}
                label="Hardware / Server Specs Notes"
                placeholder="Add special notes on RAM/CPU allocations or access scripts..."
                multiline
                rows={2}
                fullWidth
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

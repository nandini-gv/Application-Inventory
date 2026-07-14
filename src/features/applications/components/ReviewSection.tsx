import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Grid,
  Typography,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import type { ApplicationFormValues } from '../schemas/applicationFormSchema';

export const ReviewSection: React.FC = () => {
  const { getValues } = useFormContext<ApplicationFormValues>();
  const values = getValues();

  const renderSectionHeader = (title: string) => (
    <Box sx={{ mb: 1.5, mt: 1 }}>
      <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </Typography>
      <Divider sx={{ mt: 0.5, opacity: 0.1 }} />
    </Box>
  );

  const renderInfoItem = (label: string, val?: any) => {
    const displayVal = Array.isArray(val) ? val.join(', ') : val;
    return (
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2" color="#FFFFFF" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
          {displayVal || '—'}
        </Typography>
      </Box>
    );
  };

  const configuredEnvironments = Object.keys(values.environments || {})
    .filter((envName) => {
      const env = values.environments?.[envName as 'DEV' | 'SIT' | 'UAT' | 'PREPROD' | 'PROD'];
      return env?.uiUrl || env?.backendUrl || env?.serverUrl;
    });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Grid container spacing={3}>
        {/* General details */}
        <Grid size={{ xs: 12, md: 6 }}>
          {renderSectionHeader('General Info')}
          {renderInfoItem('Application Name', values.name)}
          {renderInfoItem('Application ID', values.appId)}
          {renderInfoItem('Version', values.version)}
          {renderInfoItem('Lifecycle Status', values.status)}
          {renderInfoItem('Hosting Model', values.hostingType)}
          {renderInfoItem('Deployment Method', values.deploymentMethod)}
        </Grid>

        {/* Ownership */}
        <Grid size={{ xs: 12, md: 6 }}>
          {renderSectionHeader('Ownership & Support')}
          {renderInfoItem('Business Units', values.owner?.businessUnits)}
          {renderInfoItem('Business Owner', values.owner?.businessOwner)}
          {renderInfoItem('Technical Owner', values.owner?.technicalOwner)}
          {renderInfoItem('Support Team', values.owner?.supportTeam)}
          {renderInfoItem('Support Email', values.owner?.supportEmail)}
        </Grid>

        {/* Stacks */}
        <Grid size={{ xs: 12 }}>
          {renderSectionHeader('Technology Stack')}
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>{renderInfoItem('Frontend', values.technology?.frontend)}</Grid>
            <Grid size={{ xs: 6, sm: 3 }}>{renderInfoItem('Backend', values.technology?.backend)}</Grid>
            <Grid size={{ xs: 6, sm: 3 }}>{renderInfoItem('Middleware', values.technology?.middleware)}</Grid>
            <Grid size={{ xs: 6, sm: 3 }}>{renderInfoItem('Authentication', values.technology?.authentication)}</Grid>
          </Grid>
        </Grid>

        {/* Environments configured info */}
        <Grid size={{ xs: 12 }}>
          {renderSectionHeader('Environment Configured States')}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            {configuredEnvironments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No environment node endpoints mapped.
              </Typography>
            ) : (
              configuredEnvironments.map((env) => (
                <Chip key={env} label={env} color="secondary" size="small" sx={{ fontWeight: 700 }} />
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

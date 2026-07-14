import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { ApplicationFormValues } from '../schemas/applicationFormSchema';
import { MASTER_DATA } from '../../../shared/config/masterData';

export const TelemetrySection: React.FC = () => {
  const { control, watch, formState: { errors } } = useFormContext<ApplicationFormValues>();
  
  const telemetryEnabled = watch('telemetry.telemetryEnabled');

  const AnyTextField = TextField as any;
  const AnyFormControl = FormControl as any;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Controller
          name="telemetry.telemetryEnabled"
          control={control}
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...fieldProps}
                  checked={Boolean(value)}
                  onChange={(e) => onChange(e.target.checked)}
                  color="secondary"
                />
              }
              label="Enable Application Telemetry Logging Integration"
            />
          )}
        />
      </Box>

      {telemetryEnabled && (
        <Box
          sx={{
            p: 3.5,
            borderRadius: 3,
            border: '1px solid rgba(6, 182, 212, 0.15)',
            bgcolor: 'rgba(6, 182, 212, 0.01)',
          }}
        >
          <Typography variant="subtitle2" color="secondary.light" sx={{ fontWeight: 700, mb: 3 }}>
            OpenSearch Telemetry Logging Setup
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="telemetry.opensearchDashboard"
                control={control}
                render={({ field }) => (
                  <AnyTextField
                    {...field}
                    label="OpenSearch Dashboard Link"
                    placeholder="https://opensearch.enterprise.com/dashboards/..."
                    fullWidth
                    error={Boolean(errors.telemetry?.opensearchDashboard)}
                    helperText={errors.telemetry?.opensearchDashboard?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="telemetry.serviceName"
                control={control}
                render={({ field }) => (
                  <AnyTextField
                    {...field}
                    label="Application Service Name"
                    placeholder="e.g. sp-sync-service"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="telemetry.opensearchIndex"
                control={control}
                render={({ field }) => (
                  <AnyTextField
                    {...field}
                    label="OpenSearch Log Index Pattern"
                    placeholder="e.g. logstash-sp-sync-*"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="telemetry.environment"
                control={control}
                render={({ field }) => (
                  <AnyFormControl fullWidth>
                    <InputLabel id="telemetry-env-label">Monitoring Environment</InputLabel>
                    <Select
                      {...field}
                      labelId="telemetry-env-label"
                      label="Monitoring Environment"
                    >
                      {MASTER_DATA.ENVIRONMENTS.map((env) => (
                        <MenuItem key={env} value={env}>
                          {env}
                        </MenuItem>
                      ))}
                    </Select>
                  </AnyFormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="telemetry.healthEndpoint"
                control={control}
                render={({ field }) => (
                  <AnyTextField
                    {...field}
                    label="Health Endpoint URL"
                    placeholder="https://app.enterprise.com/health"
                    fullWidth
                    error={Boolean(errors.telemetry?.healthEndpoint)}
                    helperText={errors.telemetry?.healthEndpoint?.message}
                  />
                )}
              />
            </Grid>

            {/* Availability / latency mock input seeds */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="telemetry.availability"
                control={control}
                render={({ field }) => (
                  <AnyTextField
                    {...field}
                    type="number"
                    label="Mock Availability Target (%)"
                    placeholder="e.g. 99.98"
                    fullWidth
                    error={Boolean(errors.telemetry?.availability)}
                    helperText={errors.telemetry?.availability?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="telemetry.responseTime"
                control={control}
                render={({ field }) => (
                  <AnyTextField
                    {...field}
                    type="number"
                    label="Mock Avg Response Time (ms)"
                    placeholder="e.g. 150"
                    fullWidth
                    error={Boolean(errors.telemetry?.responseTime)}
                    helperText={errors.telemetry?.responseTime?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

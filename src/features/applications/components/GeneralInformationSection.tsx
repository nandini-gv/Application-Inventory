import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { MASTER_DATA } from '../../../shared/config/masterData';
import type { ApplicationFormValues } from '../schemas/applicationFormSchema';

export const GeneralInformationSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext<ApplicationFormValues>();

  const AnyTextField = TextField as any;
  const AnyFormControl = FormControl as any;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Application Name"
              placeholder="e.g. SharePoint Integration Portal"
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="appId"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Application ID / Code"
              placeholder="e.g. SP-PORTAL-SYNC"
              fullWidth
              error={Boolean(errors.appId)}
              helperText={errors.appId?.message || 'Unique code (alphanumeric, dashes, underscores only)'}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Application Description"
              placeholder="Describe the application scope and business utilities..."
              multiline
              rows={3}
              fullWidth
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="version"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Application Version"
              placeholder="e.g. 1.0.0"
              fullWidth
              error={Boolean(errors.version)}
              helperText={errors.version?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <AnyFormControl fullWidth error={Boolean(errors.status)}>
              <InputLabel id="status-select-label">Lifecycle Status</InputLabel>
              <Select
                {...field}
                labelId="status-select-label"
                label="Lifecycle Status"
              >
                {MASTER_DATA.APPLICATION_STATUSES.map((statusVal) => (
                  <MenuItem key={statusVal} value={statusVal}>
                    {statusVal}
                  </MenuItem>
                ))}
              </Select>
              {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
            </AnyFormControl>
          )}
        />
      </Grid>
    </Grid>
  );
};

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  TextField,
  Grid,
  Autocomplete,
  Chip,
} from '@mui/material';
import { MASTER_DATA } from '../../../shared/config/masterData';
import type { ApplicationFormValues } from '../schemas/applicationFormSchema';

export const OwnershipSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext<ApplicationFormValues>();

  const AnyTextField = TextField as any;
  const AnyAutocomplete = Autocomplete as any;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="owner.businessUnits"
          control={control}
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <AnyAutocomplete
              {...fieldProps}
              multiple
              options={MASTER_DATA.BUSINESS_UNITS}
              value={value || []}
              onChange={(_event: any, newValue: string[]) => onChange(newValue)}
              renderTags={(tagValue: string[], getTagProps: any) =>
                tagValue.map((option: string, index: number) => (
                  <Chip
                    label={option}
                    size="small"
                    color="primary"
                    variant="outlined"
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params: any) => (
                <AnyTextField
                  {...params}
                  label="Business Units"
                  placeholder="Select one or more Business Units"
                  error={Boolean(errors.owner?.businessUnits)}
                  helperText={errors.owner?.businessUnits?.message}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="owner.businessOwner"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Business Owner (Sponsor)"
              placeholder="e.g. Sarah Jenkins"
              fullWidth
              error={Boolean(errors.owner?.businessOwner)}
              helperText={errors.owner?.businessOwner?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="owner.technicalOwner"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Technical Owner (Lead Architect)"
              placeholder="e.g. Alex Rivers"
              fullWidth
              error={Boolean(errors.owner?.technicalOwner)}
              helperText={errors.owner?.technicalOwner?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="owner.supportTeam"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Support Team Name"
              placeholder="e.g. POS Billing Devs"
              fullWidth
              error={Boolean(errors.owner?.supportTeam)}
              helperText={errors.owner?.supportTeam?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="owner.supportEmail"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Support Group Email"
              placeholder="e.g. team-support@enterprise.com"
              fullWidth
              error={Boolean(errors.owner?.supportEmail)}
              helperText={errors.owner?.supportEmail?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="owner.supportContact"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Support Contact Number"
              placeholder="e.g. +1-555-0190"
              fullWidth
              error={Boolean(errors.owner?.supportContact)}
              helperText={errors.owner?.supportContact?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

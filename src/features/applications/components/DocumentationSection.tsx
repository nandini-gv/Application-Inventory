import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Grid } from '@mui/material';
import type { ApplicationFormValues } from '../schemas/applicationFormSchema';

export const DocumentationSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext<ApplicationFormValues>();

  const AnyTextField = TextField as any;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="documents.repositoryUrl"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Repository URL"
              placeholder="https://github.com/company/repo"
              fullWidth
              error={Boolean(errors.documents?.repositoryUrl)}
              helperText={errors.documents?.repositoryUrl?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="documents.confluenceUrl"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Confluence Space URL"
              placeholder="https://confluence.company.com/pages/..."
              fullWidth
              error={Boolean(errors.documents?.confluenceUrl)}
              helperText={errors.documents?.confluenceUrl?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="documents.teamsChannelUrl"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Teams Channel Link"
              placeholder="MS Teams deep link URL"
              fullWidth
              error={Boolean(errors.documents?.teamsChannelUrl)}
              helperText={errors.documents?.teamsChannelUrl?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="documents.swaggerUrl"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Swagger OpenAPI URL"
              placeholder="https://api.company.com/swagger/index.html"
              fullWidth
              error={Boolean(errors.documents?.swaggerUrl)}
              helperText={errors.documents?.swaggerUrl?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="documents.architectureDiagramUrl"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Architecture Diagram URL"
              placeholder="Link to Visio, Miro, or Lucidchart spec"
              fullWidth
              error={Boolean(errors.documents?.architectureDiagramUrl)}
              helperText={errors.documents?.architectureDiagramUrl?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="documents.runbookUrl"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Operational Runbook URL"
              placeholder="Runbooks documentation target"
              fullWidth
              error={Boolean(errors.documents?.runbookUrl)}
              helperText={errors.documents?.runbookUrl?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="documents.jenkinsUrl"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Jenkins CI URL"
              placeholder="Jenkins pipeline target link"
              fullWidth
              error={Boolean(errors.documents?.jenkinsUrl)}
              helperText={errors.documents?.jenkinsUrl?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="documents.sonarQubeUrl"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="SonarQube Dashboard URL"
              placeholder="Code coverage stats page"
              fullWidth
              error={Boolean(errors.documents?.sonarQubeUrl)}
              helperText={errors.documents?.sonarQubeUrl?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="documents.nexusUrl"
          control={control}
          render={({ field }) => (
            <AnyTextField
              {...field}
              label="Nexus Artifact Repo URL"
              placeholder="Packages repository target"
              fullWidth
              error={Boolean(errors.documents?.nexusUrl)}
              helperText={errors.documents?.nexusUrl?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

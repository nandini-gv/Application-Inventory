import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  TextField,
  Grid,
  Autocomplete,
  Chip,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import type { ApplicationFormValues } from '../schemas/applicationFormSchema';
import { MASTER_DATA } from '../../../shared/config/masterData';

const SUGGESTIONS = {
  frontend: ['React', 'Angular', 'Vue.js', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'TailwindCSS', 'Material UI'],
  backend: ['Java', 'Spring Boot', '.NET 8 Core', 'C#', 'Node.js', 'Express.js', 'NestJS', 'Python', 'Django', 'FastAPI', 'Flask', 'Go', 'Gin'],
  middleware: ['REST API', 'GraphQL', 'gRPC', 'SOAP Web Services', 'API Gateway', 'WCF Bridge'],
  authentication: ['MSAL', 'Azure AD SSO', 'OAuth 2.0', 'OpenID Connect', 'SAML 2.0', 'Keycloak', 'Auth0', 'API Key'],
  messaging: ['Kafka', 'RabbitMQ', 'ActiveMQ', 'AWS SQS', 'AWS SNS'],
  cache: ['Redis', 'Memcached', 'In-Memory Cache'],
  monitoring: ['OpenSearch Logger', 'Dynatrace', 'AppDynamics', 'Prometheus', 'Grafana'],
  other: ['Docker', 'Kubernetes (AKS)', 'Kubernetes (EKS)', 'Terraform', 'AWS CDK', 'Jenkins CI'],
};

export const TechnologySection: React.FC = () => {
  const { control, watch } = useFormContext<ApplicationFormValues>();
  
  const deploymentMethod = watch('deploymentMethod');

  const AnyTextField = TextField as any;
  const AnyAutocomplete = Autocomplete as any;
  const AnyFormControl = FormControl as any;

  const renderTechAutocomplete = (
    name: keyof ApplicationFormValues['technology'],
    label: string,
    suggestions: string[]
  ) => {
    return (
      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={name}>
        <Controller
          name={`technology.${name}`}
          control={control}
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <AnyAutocomplete
              {...fieldProps}
              multiple
              freeSolo
              options={suggestions}
              value={value || []}
              onChange={(_event: any, newValue: string[]) => onChange(newValue)}
              renderTags={(tagValue: string[], getTagProps: any) =>
                tagValue.map((option: string, index: number) => (
                  <Chip
                    label={option}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params: any) => (
                <AnyTextField
                  {...params}
                  label={label}
                  placeholder="Type & Enter"
                  fullWidth
                />
              )}
            />
          )}
        />
      </Grid>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Tech Stack autocompletes */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 2 }}>
          Technology Stack
        </Typography>
        <Grid container spacing={2.5}>
          {renderTechAutocomplete('frontend', 'Frontend', SUGGESTIONS.frontend)}
          {renderTechAutocomplete('backend', 'Backend', SUGGESTIONS.backend)}
          {renderTechAutocomplete('middleware', 'Middleware', SUGGESTIONS.middleware)}
          {renderTechAutocomplete('authentication', 'Authentication', SUGGESTIONS.authentication)}
          {renderTechAutocomplete('messaging', 'Messaging', SUGGESTIONS.messaging)}
          {renderTechAutocomplete('cache', 'Cache', SUGGESTIONS.cache)}
          {renderTechAutocomplete('monitoring', 'Monitoring', SUGGESTIONS.monitoring)}
          {renderTechAutocomplete('other', 'Other Stacks', SUGGESTIONS.other)}
        </Grid>
      </Box>

      <Divider sx={{ opacity: 0.08 }} />

      {/* Hosting & Deployments */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 2.5 }}>
          Infrastructure & Hosting Model
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="hostingType"
              control={control}
              render={({ field }) => (
                <AnyFormControl fullWidth>
                  <InputLabel id="hosting-select-label">Hosting Type</InputLabel>
                  <Select
                    {...field}
                    labelId="hosting-select-label"
                    label="Hosting Type"
                  >
                    {MASTER_DATA.HOSTING_TYPES.map((h) => (
                      <MenuItem key={h} value={h}>{h}</MenuItem>
                    ))}
                  </Select>
                </AnyFormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="deploymentMethod"
              control={control}
              render={({ field }) => (
                <AnyFormControl fullWidth>
                  <InputLabel id="deploy-select-label">Deployment Method</InputLabel>
                  <Select
                    {...field}
                    labelId="deploy-select-label"
                    label="Deployment Method"
                  >
                    {MASTER_DATA.DEPLOYMENT_METHODS.map((d) => (
                      <MenuItem key={d} value={d}>{d}</MenuItem>
                    ))}
                  </Select>
                </AnyFormControl>
              )}
            />
          </Grid>

          {/* Conditional Docker details */}
          {deploymentMethod === 'Docker' && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  border: '1px solid rgba(124, 58, 237, 0.15)',
                  bgcolor: 'rgba(124, 58, 237, 0.01)',
                }}
              >
                <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 700, mb: 2.5 }}>
                  Docker Container Specifications
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                      name="dockerDetails.imageName"
                      control={control}
                      render={({ field }) => (
                        <AnyTextField
                          {...field}
                          label="Image Name"
                          placeholder="e.g. billing-service"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                      name="dockerDetails.registry"
                      control={control}
                      render={({ field }) => (
                        <AnyTextField
                          {...field}
                          label="Docker Registry"
                          placeholder="e.g. docker.io/company"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                      name="dockerDetails.containerName"
                      control={control}
                      render={({ field }) => (
                        <AnyTextField
                          {...field}
                          label="Container Name"
                          placeholder="e.g. billing-app-1"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                      name="dockerDetails.namespace"
                      control={control}
                      render={({ field }) => (
                        <AnyTextField
                          {...field}
                          label="K8s Namespace"
                          placeholder="e.g. billing-prod"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

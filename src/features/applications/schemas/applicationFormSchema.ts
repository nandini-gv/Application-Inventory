import { z } from 'zod';
import { MASTER_DATA } from '../../../shared/config/masterData';

export const environmentSchema = z.object({
  envName: z.enum(MASTER_DATA.ENVIRONMENTS),
  uiUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  backendUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  databaseUrl: z.string().or(z.literal('')).optional(),
  serverUrl: z.string().or(z.literal('')).optional(),
  serverIp: z.string().or(z.literal('')).optional(),
  appPool: z.string().optional(),
  dockerImage: z.string().optional(),
  dockerRegistry: z.string().optional(),
  containerName: z.string().optional(),
  repoUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  deploymentNotes: z.string().optional(),
  serverNotes: z.string().optional(),
  opensearchDashboard: z.string().url('Invalid URL').or(z.literal('')).optional(),
  healthEndpoint: z.string().url('Invalid URL').or(z.literal('')).optional(),
});

export const ownerSchema = z.object({
  businessUnits: z.array(z.string()).min(1, 'At least one Business Unit must be selected'),
  businessOwner: z.string().min(1, 'Business Owner is required'),
  technicalOwner: z.string().min(1, 'Technical Owner is required'),
  supportTeam: z.string().min(1, 'Support Team is required'),
  supportEmail: z.string().email('Enter a valid email').min(1, 'Support email is required'),
  supportContact: z.string().min(1, 'Support contact is required'),
});

export const technologySchema = z.object({
  frontend: z.array(z.string()),
  backend: z.array(z.string()),
  middleware: z.array(z.string()),
  authentication: z.array(z.string()),
  messaging: z.array(z.string()),
  cache: z.array(z.string()),
  monitoring: z.array(z.string()),
  other: z.array(z.string()),
});

export const telemetrySchema = z.object({
  telemetryEnabled: z.boolean(),
  opensearchDashboard: z.string().url('Invalid URL').or(z.literal('')).optional(),
  serviceName: z.string().optional(),
  opensearchIndex: z.string().optional(),
  environment: z.string().optional(),
  healthEndpoint: z.string().url('Invalid URL').or(z.literal('')).optional(),
  availability: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().min(0).max(100).optional()),
  responseTime: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().min(0).optional()),
  lastHeartbeat: z.string().optional(),
});

export const documentLinksSchema = z.object({
  repositoryUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  confluenceUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  teamsChannelUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  swaggerUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  architectureDiagramUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  runbookUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  jenkinsUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  sonarQubeUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  nexusUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
});

export const applicationFormSchema = z.object({
  name: z.string().min(1, 'Application Name is required'),
  description: z.string().min(1, 'Description is required'),
  appId: z.string().min(1, 'Application ID is required').regex(/^[A-Z0-9_-]+$/i, 'Alphanumeric and dashes/underscores only'),
  version: z.string().min(1, 'Version is required'),
  status: z.enum(MASTER_DATA.APPLICATION_STATUSES),
  hostingType: z.enum(MASTER_DATA.HOSTING_TYPES),
  deploymentMethod: z.enum(MASTER_DATA.DEPLOYMENT_METHODS),
  dockerDetails: z.object({
    imageName: z.string().min(1, 'Docker image name is required'),
    registry: z.string().min(1, 'Registry server is required'),
    containerName: z.string().min(1, 'Container name is required'),
    namespace: z.string().min(1, 'Kubernetes Namespace is required'),
  }).optional(),
  owner: ownerSchema,
  technology: technologySchema,
  environments: z.record(z.enum(MASTER_DATA.ENVIRONMENTS), environmentSchema),
  telemetry: telemetrySchema,
  documents: documentLinksSchema,
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
export type EnvironmentFormValues = z.infer<typeof environmentSchema>;

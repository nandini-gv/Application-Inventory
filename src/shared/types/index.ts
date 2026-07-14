import type {
  ApplicationStatus,
  HostingType,
  DeploymentMethod,
  EnvironmentName,
} from '../config/masterData';

export interface Environment {
  envName: EnvironmentName;
  uiUrl?: string;
  backendUrl?: string;
  databaseUrl?: string;
  serverUrl?: string;
  serverIp?: string;
  appPool?: string;
  dockerImage?: string;
  dockerRegistry?: string;
  containerName?: string;
  repoUrl?: string;
  deploymentNotes?: string;
  serverNotes?: string;
  opensearchDashboard?: string;
  healthEndpoint?: string;
}

export interface Owner {
  businessUnits: string[];
  businessOwner: string;
  technicalOwner: string;
  supportTeam: string;
  supportEmail: string;
  supportContact: string;
}

export interface Technology {
  frontend: string[];
  backend: string[];
  middleware: string[];
  authentication: string[];
  messaging: string[];
  cache: string[];
  monitoring: string[];
  other: string[];
}

export interface Telemetry {
  telemetryEnabled: boolean;
  opensearchDashboard?: string;
  serviceName?: string;
  opensearchIndex?: string;
  environment?: string;
  healthEndpoint?: string;
  availability?: number;
  responseTime?: number;
  lastHeartbeat?: string;
}

export interface DocumentLinks {
  repositoryUrl?: string;
  confluenceUrl?: string;
  teamsChannelUrl?: string;
  swaggerUrl?: string;
  architectureDiagramUrl?: string;
  runbookUrl?: string;
  jenkinsUrl?: string;
  sonarQubeUrl?: string;
  nexusUrl?: string;
}

export interface HistoryLog {
  id: string;
  event: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface DockerDetails {
  imageName: string;
  registry: string;
  containerName: string;
  namespace: string;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  appId: string;
  version: string;
  status: ApplicationStatus;
  hostingType: HostingType;
  deploymentMethod: DeploymentMethod;
  dockerDetails?: DockerDetails;
  owner: Owner;
  technology: Technology;
  environments: Record<EnvironmentName, Environment>;
  telemetry: Telemetry;
  documents: DocumentLinks;
  history: HistoryLog[];
  lastUpdated: string;
}

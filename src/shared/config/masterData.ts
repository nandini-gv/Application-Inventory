export const MASTER_DATA = {
  BUSINESS_UNITS: [
    'Max',
    'Lifestyle',
    'Spar',
    'Babyshop',
    'Home Centre',
    'Home Box',
    'Shoemart',
    'SAP',
    'HRMS',
    'Corporate',
    'Supply Chain',
    'Finance',
    'IT',
    'Other',
  ],
  HOSTING_TYPES: [
    'On Premises',
    'Hybrid',
    'Cloud',
  ],
  DEPLOYMENT_METHODS: [
    'Docker',
    'Manual',
  ],
  APPLICATION_STATUSES: [
    'Active',
    'Inactive',
    'Development',
    'Deprecated',
  ],
  TECHNOLOGY_CATEGORIES: [
    'Frontend',
    'Backend',
    'Middleware',
    'Database',
    'Monitoring',
    'Authentication',
    'Cache',
    'Messaging',
    'API Gateway',
  ],
  ENVIRONMENTS: [
    'DEV',
    'SIT',
    'UAT',
    'PREPROD',
    'PROD',
  ],
} as const;

export type BusinessUnit = typeof MASTER_DATA.BUSINESS_UNITS[number];
export type HostingType = typeof MASTER_DATA.HOSTING_TYPES[number];
export type DeploymentMethod = typeof MASTER_DATA.DEPLOYMENT_METHODS[number];
export type ApplicationStatus = typeof MASTER_DATA.APPLICATION_STATUSES[number];
export type TechnologyCategory = typeof MASTER_DATA.TECHNOLOGY_CATEGORIES[number];
export type EnvironmentName = typeof MASTER_DATA.ENVIRONMENTS[number];

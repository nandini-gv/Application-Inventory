import type { IApplicationProvider } from './IApplicationProvider';
import type { Application, Environment, HistoryLog } from '../types';
import { MASTER_DATA } from '../config/masterData';

const STORAGE_KEY = 'app_hub_inventory_data_v2';

// Standard empty environment template
const createEmptyEnv = (name: typeof MASTER_DATA.ENVIRONMENTS[number]): Environment => ({
  envName: name,
});

// A collection of 30 realistic apps matching the new schema
const baseMockApps: Application[] = [
  {
    id: 'app-001',
    name: 'SharePoint Integration Portal',
    appId: 'SP-PORTAL-SYNC',
    description: 'Bridges internal file sharing indices with external SharePoint document libraries and metadata columns.',
    version: '2.4.0',
    status: 'Active',
    hostingType: 'Cloud',
    deploymentMethod: 'Docker',
    dockerDetails: {
      imageName: 'sharepoint-portal-sync',
      registry: 'docker.enterprise.com',
      containerName: 'sp-sync-worker',
      namespace: 'corp-apps',
    },
    owner: {
      businessUnits: ['Corporate', 'IT'],
      businessOwner: 'Sarah Jenkins',
      technicalOwner: 'Alex Rivers',
      supportTeam: 'Corporate Systems Team',
      supportEmail: 'sp-support@enterprise.com',
      supportContact: '+1-555-0190',
    },
    technology: {
      frontend: ['React', 'TypeScript', 'Material UI'],
      backend: ['Node.js', 'Express'],
      middleware: ['REST API Wrapper'],
      authentication: ['MSAL', 'Azure AD SSO'],
      messaging: ['Kafka Streams'],
      cache: ['Redis Cluster'],
      monitoring: ['OpenSearch Loggers'],
      other: ['Docker', 'Kubernetes'],
    },
    environments: {
      DEV: {
        envName: 'DEV',
        uiUrl: 'https://dev-sp-sync.enterprise.com',
        backendUrl: 'https://dev-sp-sync-api.enterprise.com',
        serverUrl: 'dev-k8s-node-1.enterprise.com',
        serverIp: '10.140.10.15',
        dockerImage: 'sp-sync:dev-v2.4.0',
      },
      SIT: { envName: 'SIT' },
      UAT: {
        envName: 'UAT',
        uiUrl: 'https://uat-sp-sync.enterprise.com',
        backendUrl: 'https://uat-sp-sync-api.enterprise.com',
        serverUrl: 'uat-k8s-node-2.enterprise.com',
        serverIp: '10.140.20.18',
        dockerImage: 'sp-sync:uat-v2.4.0',
      },
      PREPROD: { envName: 'PREPROD' },
      PROD: {
        envName: 'PROD',
        uiUrl: 'https://sp-sync.enterprise.com',
        backendUrl: 'https://sp-sync-api.enterprise.com',
        serverUrl: 'prod-k8s-cluster.enterprise.com',
        serverIp: '10.140.50.12',
        dockerImage: 'sp-sync:v2.4.0',
        dockerRegistry: 'docker.enterprise.com',
        containerName: 'sp-sync-prod-1',
        healthEndpoint: 'https://sp-sync-api.enterprise.com/health',
      },
    },
    telemetry: {
      telemetryEnabled: true,
      opensearchDashboard: 'https://opensearch.enterprise.com/dashboards/sp-sync',
      serviceName: 'sp-sync-service',
      opensearchIndex: 'logstash-sp-sync-*',
      environment: 'PROD',
      healthEndpoint: 'https://sp-sync-api.enterprise.com/health',
      availability: 99.98,
      responseTime: 145,
      lastHeartbeat: '10s ago',
    },
    documents: {
      repositoryUrl: 'https://github.com/enterprise/sp-portal-sync',
      confluenceUrl: 'https://wiki.enterprise.com/docs/sp-sync-runbook',
      runbookUrl: 'https://wiki.enterprise.com/docs/runbooks/sp-sync',
      swaggerUrl: 'https://sp-sync-api.enterprise.com/swagger/index.html',
    },
    history: [
      { id: 'h-1', event: 'Application Registered', user: 'Alex Rivers', timestamp: '2026-01-10T10:00:00Z', details: 'Initial setup.' },
    ],
    lastUpdated: '2026-07-14T10:30:00Z',
  },
  {
    id: 'app-002',
    name: 'AWS Core Billing Adapter',
    appId: 'AWS-BILL-CORE',
    description: 'Processes daily inventory usage records and converts billing tags data into ERP ledger items.',
    version: '1.1.2',
    status: 'Active',
    hostingType: 'Cloud',
    deploymentMethod: 'Manual',
    owner: {
      businessUnits: ['Finance', 'IT'],
      businessOwner: 'Marcus Sterling',
      technicalOwner: 'Alex Rivers',
      supportTeam: 'FinOps Team',
      supportEmail: 'billing-adapter@enterprise.com',
      supportContact: '+1-555-0182',
    },
    technology: {
      frontend: [],
      backend: ['Java 17', 'Spring Boot'],
      middleware: ['Spring Cloud Stream'],
      authentication: ['IAM Role Credentials'],
      messaging: ['SQS Queue'],
      cache: [],
      monitoring: ['OpenSearch Dashboard'],
      other: ['AWS CDK'],
    },
    environments: {
      DEV: { envName: 'DEV' },
      SIT: { envName: 'SIT' },
      UAT: { envName: 'UAT' },
      PREPROD: { envName: 'PREPROD' },
      PROD: {
        envName: 'PROD',
        serverUrl: 'aws-ecs-task-node.enterprise.com',
        serverIp: '10.200.40.50',
        deploymentNotes: 'Runs daily at 00:00 UTC via Cron schedule task.',
      },
    },
    telemetry: {
      telemetryEnabled: true,
      opensearchDashboard: 'https://opensearch.enterprise.com/dashboards/aws-billing',
      serviceName: 'aws-billing-adapter',
      opensearchIndex: 'logstash-aws-billing-*',
      environment: 'PROD',
      availability: 99.95,
      responseTime: 420,
      lastHeartbeat: '5m ago',
    },
    documents: {
      repositoryUrl: 'https://github.com/enterprise/aws-billing-adapter',
      // Missing runbook and confluence link to trigger compliance warning
    },
    history: [
      { id: 'h-1', event: 'Registry Created', user: 'Alex Rivers', timestamp: '2026-03-01T09:00:00Z' },
    ],
    lastUpdated: '2026-07-14T08:00:00Z',
  },
  {
    id: 'app-003',
    name: 'Customer Loyalty Ledger',
    appId: 'LOYAL-LEDG-CS',
    description: '.NET 8 Core transactional service managing rewards point campaigns allocations and client balances.',
    version: '3.0.4',
    status: 'Active',
    hostingType: 'On Premises',
    deploymentMethod: 'Manual',
    owner: {
      businessUnits: ['Max', 'Shoemart', 'Lifestyle'],
      businessOwner: 'Sarah Jenkins',
      technicalOwner: 'Samantha Wu',
      supportTeam: 'Loyalty Portal Team',
      supportEmail: 'loyalty-support@enterprise.com',
      supportContact: '+1-555-0210',
    },
    technology: {
      frontend: [],
      backend: ['.NET 8 Core', 'ASP.NET WebAPI'],
      middleware: ['WCF Legacy Bridge'],
      authentication: ['Windows Auth'],
      messaging: ['RabbitMQ Broker'],
      cache: ['Redis Cache Memory'],
      monitoring: [],
      other: [],
    },
    environments: {
      DEV: { envName: 'DEV' },
      SIT: { envName: 'SIT' },
      UAT: {
        envName: 'UAT',
        uiUrl: 'https://uat-loyalty.enterprise.com',
        serverUrl: 'uat-iis-node-1.enterprise.com',
        serverIp: '192.168.10.15',
      },
      PREPROD: { envName: 'PREPROD' },
      PROD: {
        envName: 'PROD',
        uiUrl: 'https://loyalty.enterprise.com',
        // Missing serverUrl to trigger missing server URL alert
        serverIp: '192.168.50.20',
      },
    },
    telemetry: {
      telemetryEnabled: false, // Telemetry disabled
    },
    documents: {
      repositoryUrl: 'https://github.com/enterprise/cust-loyalty-core',
      confluenceUrl: 'https://wiki.enterprise.com/docs/loyalty-ledger',
      runbookUrl: 'https://wiki.enterprise.com/docs/runbooks/loyalty',
    },
    history: [
      { id: 'h-1', event: 'Registered App', user: 'James Doe', timestamp: '2025-05-15T09:00:00Z' },
    ],
    lastUpdated: '2026-07-10T14:00:00Z',
  },
  {
    id: 'app-004',
    name: 'Salesforce Webhook Lead Adapter',
    appId: 'SFDC-LEAD-ADAP',
    description: 'Python lead ingestion webhook syncing new partner leads records into central sales pipelines.',
    version: '1.0.5',
    status: 'Development',
    hostingType: 'Hybrid',
    deploymentMethod: 'Docker',
    dockerDetails: {
      imageName: 'salesforce-lead-adapter',
      registry: 'registry.enterprise.com',
      containerName: 'sfdc-webhook',
      namespace: 'marketing',
    },
    owner: {
      businessUnits: ['Babyshop', 'Shoemart'],
      businessOwner: 'Sarah Jenkins',
      technicalOwner: '', // Missing Technical Owner to trigger alert
      supportTeam: 'Marketing Lead Gen Team',
      supportEmail: 'sf-leads@enterprise.com',
      supportContact: '+1-555-0982',
    },
    technology: {
      frontend: [],
      backend: ['Python 3.11', 'FastAPI'],
      middleware: ['Salesforce Webhook REST SDK'],
      authentication: ['API Key Authentication'],
      messaging: [],
      cache: ['Redis Cache'],
      monitoring: [],
      other: [],
    },
    environments: {
      DEV: { envName: 'DEV' },
      SIT: { envName: 'SIT' },
      UAT: {
        envName: 'UAT',
        uiUrl: 'https://uat-sfdc.enterprise.com',
        serverUrl: 'uat-azure-appservice.enterprise.com',
        serverIp: '10.90.10.4',
      },
      PREPROD: { envName: 'PREPROD' },
      PROD: { envName: 'PROD' }, // Missing PROD server URL to trigger missing server URL alert
    },
    telemetry: {
      telemetryEnabled: false,
    },
    documents: {
      // Missing repositoryUrl to trigger compliance alert
      confluenceUrl: 'https://wiki.enterprise.com/docs/sfdc-conn',
    },
    history: [
      { id: 'h-1', event: 'Created Draft', user: 'Clara Vance', timestamp: '2026-07-01T15:20:00Z' },
    ],
    lastUpdated: '2026-07-02T10:05:00Z',
  },
];

// Let's programmatically generate the remaining 26 applications to reach 30,
// ensuring the inventory page shows accurate metrics, BU groupings, and hosting splits.
const populateMockApps = (): Application[] => {
  const result = [...baseMockApps];
  
  const techOptions = [
    { name: 'Java ERP Adapter', stack: 'Java 17 / Spring', bu: 'Supply Chain', host: 'On Premises', dep: 'Manual', hasTele: true },
    { name: 'Max E-Commerce API', stack: 'Node.js / Express', bu: 'Max', host: 'Cloud', dep: 'Docker', hasTele: true },
    { name: 'Babyshop Order Engine', stack: '.NET 8 / C#', bu: 'Babyshop', host: 'Hybrid', dep: 'Docker', hasTele: false },
    { name: 'Shoemart Checkout Gateway', stack: 'Go 1.22 / Gin', bu: 'Shoemart', host: 'Cloud', dep: 'Docker', hasTele: true },
    { name: 'Home Centre Catalog sync', stack: 'Python / FastAPI', bu: 'Home Centre', host: 'On Premises', dep: 'Manual', hasTele: false },
    { name: 'HRMS Onboarding Daemon', stack: 'Java / Hibernate', bu: 'HRMS', host: 'On Premises', dep: 'Manual', hasTele: true },
    { name: 'SAP Ledger Exporter', stack: 'Python 3.10', bu: 'SAP', host: 'Hybrid', dep: 'Docker', hasTele: false },
    { name: 'Corporate Budget Calculator', stack: 'Node.js / React', bu: 'Corporate', host: 'Cloud', dep: 'Docker', hasTele: true },
    { name: 'Supply Chain Tracker', stack: 'Go / Fiber', bu: 'Supply Chain', host: 'Cloud', dep: 'Docker', hasTele: true },
    { name: 'Finance Audits Broker', stack: 'Java 11', bu: 'Finance', host: 'On Premises', dep: 'Manual', hasTele: false },
    { name: 'IT Security Registry', stack: '.NET Core 6', bu: 'IT', host: 'Cloud', dep: 'Docker', hasTele: true },
    { name: 'Spar POS Scheduler', stack: 'Node.js / TypeScript', bu: 'Spar', host: 'On Premises', dep: 'Manual', hasTele: false },
    { name: 'Home Box Inventory sync', stack: 'Go / Gin', bu: 'Home Box', host: 'Cloud', dep: 'Docker', hasTele: true },
    { name: 'SAP Vendor Connector', stack: 'Python / Flask', bu: 'SAP', host: 'Hybrid', dep: 'Manual', hasTele: false },
    { name: 'Lifestyle Campaign Manager', stack: 'Node.js / NestJS', bu: 'Lifestyle', host: 'Cloud', dep: 'Docker', hasTele: true },
    { name: 'Shoemart Loyalty Sync', stack: '.NET 8', bu: 'Shoemart', host: 'Hybrid', dep: 'Docker', hasTele: false },
    { name: 'HRMS Leave Processor', stack: 'Java 17', bu: 'HRMS', host: 'On Premises', dep: 'Manual', hasTele: true },
    { name: 'Corporate Identity Hub', stack: 'Java / Keycloak', bu: 'Corporate', host: 'Cloud', dep: 'Docker', hasTele: true },
    { name: 'Supply Chain API Proxy', stack: 'Go / FastHTTP', bu: 'Supply Chain', host: 'Cloud', dep: 'Docker', hasTele: false },
    { name: 'Finance Tax Calculator', stack: 'Python 3.11', bu: 'Finance', host: 'Hybrid', dep: 'Manual', hasTele: true },
    { name: 'IT Server Daemon', stack: 'Go / Fiber', bu: 'IT', host: 'On Premises', dep: 'Manual', hasTele: false },
    { name: 'Lifestyle Promo Dispatcher', stack: 'Node.js', bu: 'Lifestyle', host: 'Cloud', dep: 'Docker', hasTele: true },
    { name: 'Babyshop Lead Collector', stack: 'Python', bu: 'Babyshop', host: 'Cloud', dep: 'Docker', hasTele: false },
    { name: 'Spar Daily Ledger Sync', stack: 'Java 11', bu: 'Spar', host: 'On Premises', dep: 'Manual', hasTele: true },
    { name: 'Home Box Delivery Worker', stack: '.NET Core', bu: 'Home Box', host: 'Cloud', dep: 'Docker', hasTele: true },
    { name: 'Home Centre Budget Sync', stack: 'Python', bu: 'Home Centre', host: 'Hybrid', dep: 'Manual', hasTele: false },
  ];

  techOptions.forEach((o, i) => {
    const idx = i + 5;
    const isMissingRepo = idx % 7 === 0;
    const isMissingDoc = idx % 5 === 0;
    const isMissingOwner = idx % 11 === 0;
    const isMissingServer = idx % 6 === 0;

    const app: Application = {
      id: `app-0${idx}`,
      name: o.name,
      appId: `${o.bu.substring(0,4).toUpperCase()}-${o.name.substring(0,4).toUpperCase()}-${idx}`,
      description: `Automated enterprise module for ${o.name} operations, tracking metadata configurations and infrastructure mappings.`,
      version: `1.0.${idx}`,
      status: idx % 8 === 0 ? 'Deprecated' : idx % 13 === 0 ? 'Inactive' : 'Active',
      hostingType: o.host as any,
      deploymentMethod: o.dep as any,
      owner: {
        businessUnits: [o.bu, 'IT'],
        businessOwner: idx % 2 === 0 ? 'Marcus Sterling' : 'Sarah Jenkins',
        technicalOwner: isMissingOwner ? '' : 'Samantha Wu',
        supportTeam: `${o.bu} Core Support`,
        supportEmail: `support-${o.bu.toLowerCase().replace(' ', '')}@enterprise.com`,
        supportContact: `+1-555-090${idx}`,
      },
      technology: {
        frontend: o.stack.includes('React') ? ['React', 'Material UI'] : [],
        backend: o.stack.split(' / '),
        middleware: ['Enterprise Service Bus Proxy'],
        authentication: ['OAuth Client Credentials'],
        messaging: ['RabbitMQ Queue'],
        cache: ['Redis Memory Cluster'],
        monitoring: o.hasTele ? ['OpenSearch Logger'] : [],
        other: o.dep === 'Docker' ? ['Docker', 'Kubernetes'] : [],
      },
      environments: {
        DEV: createEmptyEnv('DEV'),
        SIT: createEmptyEnv('SIT'),
        UAT: createEmptyEnv('UAT'),
        PREPROD: createEmptyEnv('PREPROD'),
        PROD: {
          envName: 'PROD',
          uiUrl: `https://prod-${o.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.enterprise.com`,
          serverUrl: isMissingServer ? undefined : `prod-srv-node-${idx}.enterprise.com`,
          serverIp: `10.120.30.${idx + 5}`,
        },
      },
      telemetry: {
        telemetryEnabled: o.hasTele,
        opensearchDashboard: o.hasTele ? `https://opensearch.enterprise.com/dashboards/${idx}` : undefined,
        serviceName: o.hasTele ? `${o.name.toLowerCase().replace(' ', '-')}-service` : undefined,
        opensearchIndex: o.hasTele ? `logstash-${o.name.toLowerCase().replace(' ', '-')}-*` : undefined,
        environment: 'PROD',
        availability: o.hasTele ? parseFloat((99.5 + (idx % 50) / 100).toFixed(2)) : undefined,
        responseTime: o.hasTele ? 80 + (idx * 5) : undefined,
        lastHeartbeat: o.hasTele ? '1m ago' : undefined,
      },
      documents: {
        repositoryUrl: isMissingRepo ? undefined : `https://github.com/enterprise/repo-app-${idx}`,
        confluenceUrl: isMissingDoc ? undefined : `https://wiki.enterprise.com/docs/confluence-app-${idx}`,
        runbookUrl: isMissingDoc ? undefined : `https://wiki.enterprise.com/docs/runbooks/app-${idx}`,
      },
      history: [
        { id: `h-${idx}-1`, event: 'Application Registered', user: 'System Deployer', timestamp: '2026-06-15T09:00:00Z' },
      ],
      lastUpdated: new Date(Date.now() - idx * 24 * 3600 * 1000).toISOString(),
    };

    result.push(app);
  });

  return result;
};

let db: Application[] = [];

try {
  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    db = JSON.parse(localData);
  } else {
    db = populateMockApps();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
} catch (err) {
  console.error('Failed to initialize Mock DB:', err);
  db = populateMockApps();
}

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to persist Mock DB:', err);
  }
};

export class MockApplicationProvider implements IApplicationProvider {
  async getApplications(): Promise<Application[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...db];
  }

  async getApplicationById(id: string): Promise<Application | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const found = db.find((a) => a.id === id);
    return found ? { ...found } : null;
  }

  async createApplication(
    newApp: Omit<Application, 'id' | 'lastUpdated' | 'history'>
  ): Promise<Application> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const timestamp = new Date().toISOString();
    const id = `app-0${Math.floor(100 + Math.random() * 900)}`;
    const history: HistoryLog[] = [
      {
        id: `h-${Math.random().toString(36).substring(2, 6)}`,
        event: 'Application Created',
        user: 'Enterprise User',
        timestamp,
        details: 'Registered through portal UI wizard.',
      },
    ];

    const created: Application = {
      ...newApp,
      id,
      lastUpdated: timestamp,
      history,
    };

    db.push(created);
    persist();
    return created;
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const idx = db.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw new Error(`Application with ID ${id} not found.`);
    }

    const current = db[idx];
    const timestamp = new Date().toISOString();
    const history = [...(current.history || [])];

    if (updates.status && updates.status !== current.status) {
      history.push({
        id: `h-${Math.random().toString(36).substring(2, 6)}`,
        event: `Status Updated to ${updates.status}`,
        user: 'Enterprise User',
        timestamp,
      });
    }

    const updated: Application = {
      ...current,
      ...updates,
      id,
      history,
      lastUpdated: timestamp,
    };

    db[idx] = updated;
    persist();
    return updated;
  }

  async deleteApplication(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const initialLen = db.length;
    db = db.filter((a) => a.id !== id);
    persist();
    return db.length < initialLen;
  }
}

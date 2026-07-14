# Application Hub — Enterprise Application Inventory & Tracking Portal

Application Hub is an internal enterprise-grade directory and lifecycle tracking portal designed to act as the single source of truth for corporate applications. It enables developers, architects, and product owners to register applications, monitor lifecycle changes, audit ownership details, track staging/production environment endpoints, and verify OpenSearch logging telemetry.

Inspired by premium product portals (such as Stripe, Linear, and Vercel), this application is built with a custom dark theme featuring radial mesh backgrounds, glassmorphic containers, and responsive layouts.

---

## 🚀 Key Features

- **SSO Authentication Simulator**: Simulated Microsoft Entra ID (Azure AD) flow using high-fidelity popup choice dialogs (`window.open` + `postMessage` event listeners) to fetch administrator/developer credentials.
- **Application Inventory Catalog**: Toggleable Card/Table views with instant global searches, advanced multi-criteria drawers (filtering by Business Unit, Tech Stack, Hosting, Telemetry status, Lifecycle Status), table paginations, and CSV data exporters.
- **5-Step Registration Wizard**: Validation-guided stepper mapping:
  1. General Information (App ID, Description, Version, Initial Status)
  2. Accountable Stakeholders (Business Sponsor, Tech Owner, Support Email, Developer Lists)
  3. Technical Infrastructure Specs (Databases, Repository Git links, Server hosting types)
  4. Environments & Telemetry (URLs mappings, optional OpenSearch logs details)
  5. Review & Submit / Draft Persistence
- **Detailed Telemetry Overviews**: Tabbed sections showcasing application descriptions, owner listings, infrastructure nodes, deployment credentials, dynamic OpenSearch index links, alert contacts, logs audit trails, and version changes history.
- **Insights & Visual Distribution**: Responsive custom SVG chart widgets showing counts of applications by Business Unit, language distribution stacks, hosting providers, telemetry coverages, and metadata quality alerts.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Material UI (MUI v6)
- **Animations**: Framer Motion
- **SSO Simulation**: Local Storage caching + postMessage popup handlers
- **Celebration Reward**: canvas-confetti

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

### Building for Production
To compile and bundle optimized client assets:
```bash
npm run build
```
Compiled production files are outputted to the `/dist` directory.

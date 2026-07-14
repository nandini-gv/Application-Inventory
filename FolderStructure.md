# Folder Structure — Application Hub

Below is the directory structure of the Application Hub project.

```
src/
├── app/                        # Application bootstrap & routing layer
│   ├── App.tsx                 # Core App wrapper loaded with providers
│   ├── AppRoutes.tsx           # Application paths and navigation routing rules
│   ├── Login.tsx               # Splash login gateway screen
│   └── MSLoginPopup.tsx        # Microsoft Entra login popup select screen
├── assets/                     # Static media and logo files
├── components/                 # Reusable generic UI components
│   ├── GlassCard.tsx           # Glassmorphic framer-motion card wrapper
│   └── GlobalSearch.tsx        # Command-K inventory launcher popup modal
├── features/                   # Core business features
│   ├── dashboard/              # Statistics widgets and activity charts
│   │   └── pages/
│   │       └── Dashboard.tsx
│   ├── applications/           # Inventory register, view, detail modules
│   │   ├── components/         # Wizard registration stepper steps & sub-cards
│   │   │   ├── GeneralInformationSection.tsx
│   │   │   ├── OwnershipSection.tsx
│   │   │   ├── TechnologySection.tsx
│   │   │   ├── EnvironmentCard.tsx
│   │   │   ├── EnvironmentSection.tsx
│   │   │   ├── DocumentationSection.tsx
│   │   │   ├── TelemetrySection.tsx
│   │   │   └── ReviewSection.tsx
│   │   ├── schemas/            # Zod validation schema objects
│   │   │   └── applicationFormSchema.ts
│   │   └── pages/
│   │       ├── Inventory.tsx
│   │       ├── AppDetails.tsx
│   │       └── RegisterApp.tsx
│   ├── insights/               # SVG analytics visualizations
│   │   └── pages/
│   │       └── Insights.tsx
│   └── settings/               # Environment variables configuration panel
│       └── pages/
│           └── Settings.tsx
├── shared/                     # Shared cross-cutting components & services
│   ├── config/
│   │   └── masterData.ts       # Dropdowns options lists (BUs, Environments...)
│   ├── context/
│   │   └── AuthContext.tsx     # Simulated Entra ID SSO state context provider
│   ├── hooks/
│   │   └── useAuth.ts          # Session getter helper hook
│   ├── layouts/                # Master UI layout shells
│   │   ├── DashboardShell.tsx  # Coordinates sidebar/header frames & key shortcuts
│   │   ├── Header.tsx          # Dynamic breadcrumbs, profile, & notifications
│   │   └── Sidebar.tsx         # Collapsible menu navigation bar
│   ├── services/               # Data access logic providers & orchestrator
│   │   ├── IApplicationProvider.ts   # Provider pattern interface contracts
│   │   ├── MockApplicationProvider.ts# LocalStorage db provider and 30 seeds
│   │   ├── ApplicationService.ts     # Coordination client layer orchestrating fetches
│   │   └── sharepoint/
│   │       └── SharePointApplicationProvider.ts # SharePoint integration provider mockup
│   ├── theme/
│   │   └── theme.ts            # Material UI overrides and custom fonts tokens
│   └── types/
│       └── index.ts            # Global decoupled TypeScript interfaces
├── main.tsx                    # Entry point bootstrapping React into DOM
├── index.css                   # Global style system (radial glows & mesh grids)
```

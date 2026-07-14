# Code Walkthrough — Application Hub

This document details the code files, custom theme variables, state providers, and pages components that make up the Application Hub.

---

## 🎨 Design System & Styling Core

### 1. Style Foundations ([index.css](file:///Users/nandinigv/Desktop/Application-Inventory/src/index.css))
- **Radial space glows**: Fixed cyan/violet glow patterns positioned behind glass cards.
- **Mesh grid layouts**: Subtle transparent background overlay lines.
- **Glassmorphic styles**: Blur parameters (`backdrop-filter: blur(12px)`) and transparent border styles.

### 2. Custom Theme Overrides ([theme.ts](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/theme/theme.ts))
- **Color tokens**: Violet (`#7C3AED`) as the brand accent and Cyan (`#06B6D4`) for system highlights.
- **Typography**: Display titles use the `Outfit` font family; body copy uses `Inter`.
- **Component customization**: Custom styles for standard MUI elements:
  - `MuiButton`: Customized contained and outlined styles with subtle hover transitions.
  - `MuiTextField` & `MuiOutlinedInput`: Stylized input fields with dark glass fills.
  - `MuiTabs` & `MuiTab`: Customized underline indicators and active text weights.

---

## 🔒 Session State & Services Layers

### 1. Simulated Entra ID SSO ([AuthContext.tsx](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/context/AuthContext.tsx))
- Provides user attributes, loading indicators, and logout actions to protected paths.
- Uses window communication events: opens `/ms-login` as a popup, listens for credentials payloads, and caches tokens in `localStorage`.
- Accompanying hook helper is located at [useAuth.ts](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/hooks/useAuth.ts).

### 2. Provider Abstraction & Orchestration
- **Provider contract**: [IApplicationProvider.ts](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/services/IApplicationProvider.ts) specifies the asynchronous data methods.
- **Mock provider implementation**: [MockApplicationProvider.ts](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/services/MockApplicationProvider.ts) hooks up `localStorage` storage and contains the 30 seed applications.
- **Orchestrator client**: [ApplicationService.ts](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/services/ApplicationService.ts) coordinates active provider execution. To swap mock data with SharePoint Online, update the provider mapping in this class.
- **SharePoint provider placeholder**: [SharePointApplicationProvider.ts](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/services/sharepoint/SharePointApplicationProvider.ts) outlines lists fetch adapters and token payload mappings.

---

## 🖼️ Application Shell & Master Coordinates

### 1. Main Layout Shell ([DashboardShell.tsx](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/layouts/DashboardShell.tsx))
- Handles sidebar collapse states.
- Listens for `Cmd+K`/`Ctrl+K` key combinations to toggle global search dialogs.

### 2. Top Header & Navigations ([Header.tsx](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/layouts/Header.tsx))
- Dynamically converts current React Router path urls to capitalized, linked breadcrumb elements.
- Features a notifications menu listing mock approvals alerts.

### 3. Collapsible Navigation Sidebar ([Sidebar.tsx](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/layouts/Sidebar.tsx))
- Renders collapsible menu item grids, mini profile blocks, and role badges.

---

## 📄 Pages Components

### 1. Overview Dashboard ([Dashboard.tsx](file:///Users/nandinigv/Desktop/Application-Inventory/src/features/dashboard/pages/Dashboard.tsx))
- Metric boxes displaying counts of total apps, active business units, and applications missing critical files (repos, docs, server hosts).
- Renders custom inline SVG horizontal charts displaying apps distributions per BU and hosting models.

### 2. Inventory Directory ([Inventory.tsx](file:///Users/nandinigv/Desktop/Application-Inventory/src/features/applications/pages/Inventory.tsx))
- Toggleable Grid card vs Row table views.
- Includes advanced filtering options (filtering by BU, Stack, Hosting platforms, and Telemetry statuses) managed through a sliding drawer.
- Supports CSV exports.

### 3. Details Accordion Panel ([AppDetails.tsx](file:///Users/nandinigv/Desktop/Application-Inventory/src/features/applications/pages/AppDetails.tsx))
- Groups details into collapsible accordion panels: General Information, Ownership & Support, Technology Stack, Environments Nodes, Documentation, and OpenSearch Telemetry.

### 4. Stepper Wizard ([RegisterApp.tsx](file:///Users/nandinigv/Desktop/Application-Inventory/src/features/applications/pages/RegisterApp.tsx))
- 5-step registration wizard stepper form.
- Integrates React Hook Form with Zod schemas for input validation.
- Emits a canvas confetti shower upon successful submission of a new application.

# Developer Guide — Application Hub

This guide is designed for developers onboarding to the Application Hub project. It covers local setup, project structure, coding standards, and deployment procedures.

---

## 🛠️ Local Sandbox Setup

### Prerequisites
- Node.js v18.0.0+
- npm v9.0.0+

### Setup Commands
1. **Clone the repository** (or navigate to the workspace directory).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will run locally at `http://localhost:5173`.
4. **Compile production assets**:
   ```bash
   npm run build
   ```
   Vite builds optimized static files into `/dist/` under 2 seconds.

---

## 💻 Coding Standards & Conventions

### 1. Types & Schemas
- Always type new parameters, parameters updates, or data responses in `src/shared/types/index.ts`.
- Avoid using `any` unless required for third-party library typings overrides.

### 2. Component Design & Layouts
- Maintain the glassmorphic design language: use the custom `GlassCard` wrapper for card layouts and widgets.
- Use Material UI theme components where possible, utilizing theme tokens (e.g. `primary.main`, `secondary.light`) to keep styling cohesive.
- Do not hardcode colors; refer to the styling tokens in [theme.ts](file:///Users/nandinigv/Desktop/Application-Inventory/src/shared/theme/theme.ts).

### 3. State Management & API Requests
- All components must load data asynchronously from the `ApplicationService` layer rather than referencing `localStorage` or `MockApplicationProvider` directly.
- Group similar requests into React state loaders to handle network delays.

### 4. Git Workflows
- Keep PR changes focused.
- Ensure TypeScript compiles successfully with zero warnings before submitting requests.
- Verify production bundles build clean using `npm run build` before pushing to main branches.

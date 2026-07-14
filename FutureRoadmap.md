# Future Product Roadmap — Application Hub

This roadmap outlines key enhancements planned to scale the Application Hub from a mock-backed portal into a fully integrated enterprise directory hub.

---

## 📅 Roadmap Milestones

### Phase 1: Local Portals & Validation (Current)
- Establish the dark-themed user interface, inventory views, 5-step registration steppers, SVG insights distributions, and mock authentication popups.
- Ensure 100% type-safety and support local data persistence in `localStorage`.

### Phase 2: SharePoint List Persistence
- Replace `ApplicationService` local mock calls with actual SharePoint REST API integrations.
- Utilize the credentials parameters configured in the Settings panels to establish secure Azure AD token handshakes and perform database syncs.
- Enable automated backup routines to prevent data loss.

### Phase 3: Enterprise MSAL Authentication
- Transition from the simulated authentication popups to actual Microsoft Microsoft Authentication Library (`@azure/msal-react`).
- Bind route protection controls to Azure AD user profiles.
- Configure automatic token refresh protocols to ensure smooth, uninterrupted user sessions.

### Phase 4: Live OpenSearch Telemetry Queries
- Connect the Telemetry details panel to actual OpenSearch search instances.
- Enable developers to query log indices directly from the portal, removing the need to search logs on external dashboards.
- Introduce customizable alerting metrics (e.g. email notifications, Slack alerts) for when availability drops below threshold values.

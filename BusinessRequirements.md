# Business Requirements Document (BRD) — Application Hub

## 1. Executive Summary & Problem Statement

In large enterprise environments, application cataloging is typically fragmented across multiple spreadsheets, team wikis, developer repositories, and legacy databases. This fragmentation causes several operational issues:
- **Ownership Ambiguity**: Difficulty identifying technical and business leads when systems fail.
- **Lost Artifacts**: Missing code repository links and operational runbooks.
- **Environment Drift**: Lack of central links mapping UAT staging vs Production server URLs.
- **Monitoring Blindspots**: Unknown status of logging telemetry and alert configurations.

The **Application Hub** serves as a single source of truth for application registry tracking. It helps approximately 15-20 developers, architects, and managers manage ownership records, hosting models, and system lifecycles.

---

## 2. Business Goals

- **Reduce MTTR (Mean Time to Resolution)**: Enable teams to quickly identify tech leads, runbooks, and repositories when anomalies occur.
- **Enforce Metadata Compliance**: Track missing documentation or repositories, highlighting areas of tech debt.
- **Improve Environment Visibility**: Maintain a central mapping of environment URLs (UAT, Production).
- **Monitor Telemetry Coverage**: Identify which applications have active telemetry logging and highlight unmonitored services.

---

## 3. User Personas & Roles

1. **System Architects / Platform Engineers**
   - *Needs*: Wants to view hosting models (AWS vs Azure vs On-Prem), databases in use, deployment pipelines, and Docker registry details.
   - *Role*: Registry auditors who review pending submissions.
2. **Application Owners (Business Sponsors)**
   - *Needs*: Wants to register applications and track compliance metrics.
   - *Role*: Business leads responsible for approvals and contact details.
3. **Developers & Support Engineers**
   - *Needs*: Quick access to repositories, documentation, and staging/prod environments.
   - *Role*: Registry users who submit and update application records.

---

## 4. Functional Specifications

- **Application Registration Stepper**: Guided 5-step wizard to register metadata, ownership contacts, repository/runbook links, and environment URLs.
- **Filterable Inventory Catalog**: Card/Table views with columns for Name, BU, Owners, Version, Environment, Hosting, Deployment Method, and Status.
- **CSV Data Exporter**: Export filtered listings to CSV.
- **Registry Audit Logging**: Automated history tracking for version updates and status changes.
- **Dynamic Telemetry Checks**: Display OpenSearch logs indices, alert channels, error counts, and availability stats.
- **Integrations Configurations Settings**: Placeholder settings to test SharePoint REST endpoints and MSAL SSO authentication.

---

## 5. Non-Functional Requirements

- **Zero-Trust Role Checks**: Simulated MSAL credentials parsing administrator vs developer flags.
- **Premium User Experience**: Fast page loads, glassmorphic UI cards, collapsible sidebar layouts, and Framer Motion animations.
- **High Portability**: Clean TypeScript models and modular services designed to swap mock storage with SharePoint lists later.

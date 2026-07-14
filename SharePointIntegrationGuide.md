# SharePoint Online Integration Guide — Application Hub

This guide details the implementation blueprint for replacing the mock storage layer with actual SharePoint Online Lists.

---

## 🛠️ Step 1: Swap Active Provider

Data operations are coordinated by `ApplicationService.ts`. To transition from mock data to SharePoint persistence, initialize `SharePointApplicationProvider` instead of `MockApplicationProvider`:

```typescript
// src/shared/services/ApplicationService.ts
import { SharePointApplicationProvider } from './sharepoint/SharePointApplicationProvider';

// Replace:
// private static provider: IApplicationProvider = new MockApplicationProvider();
// With:
private static provider: IApplicationProvider = new SharePointApplicationProvider();
```

---

## 🔑 Step 2: Configure Azure AD Application Credentials

To authorize requests to SharePoint Online, register an application in Azure Active Directory (Microsoft Entra ID):
1. **Azure Portal Registration**:
   - Register a new Web App registration.
   - Configure **Delegated permissions** or **Application permissions** depending on your access model.
2. **Required Microsoft Graph / SharePoint Permissions**:
   - `Sites.Read.All` or `Sites.ReadWrite.All`
   - `Lists.Read.All` or `Lists.ReadWrite.All`
3. **Portal Settings Configuration**:
   - Enter your client ID, tenant ID, and client secret in the **SharePoint Settings** tab of the portal to initialize the authorization handshake.

---

## 🔄 Step 3: REST API & Token Handshake Implementation

Your `SharePointApplicationProvider` class should perform the following actions:
1. **Retrieve Authorization Token**:
   - Post client credentials to the Microsoft Entra token endpoint:
     `POST https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token`
     Body: `client_id={clientId}&scope=https://{tenant}.sharepoint.com/.default&client_secret={clientSecret}&grant_type=client_credentials`
2. **Fetch List Items**:
   - Query list items using the SharePoint REST API:
     `GET https://{tenant}.sharepoint.com/sites/{site-name}/_api/web/lists/getbytitle('{list-name}')/items`
   - Ensure you pass the OAuth token in the request header:
     `Authorization: Bearer {token}`
     `Accept: application/json;odata=verbose`

---

## 📊 Step 4: Map SharePoint List Fields to TypeScript Schema

SharePoint items contain columns matching the `Application` interface fields. Map SharePoint payloads to match our TypeScript schema:

| TypeScript Interface Field | SharePoint Column Name | SharePoint Data Type |
| :--- | :--- | :--- |
| `id` | `GUID` / `ID` | String / Integer |
| `name` | `Title` | String |
| `appId` | `ApplicationID` | String |
| `description` | `Description` | Multi-line Plain Text |
| `version` | `AppVersion` | String |
| `status` | `LifecycleStatus` | Choice (Active, Inactive...) |
| `hostingType` | `HostingType` | Choice (Cloud, Hybrid...) |
| `deploymentMethod` | `DeploymentMethod` | Choice (Docker, IIS...) |
| `owner` | `OwnerData` | JSON / Multi-field columns |
| `technology` | `TechStackData` | JSON String |
| `environments` | `EnvironmentsConfigData` | JSON String |
| `documents` | `DocumentsData` | JSON String |
| `telemetry` | `TelemetryConfigData` | JSON String |

> [!NOTE]
> Storing complex sub-structures (e.g. `owner`, `technology`, `environments`) as serialized JSON strings inside SharePoint list columns avoids list column limitations and simplifies API integration.

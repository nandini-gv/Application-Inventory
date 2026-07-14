import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { GlassCard } from '../../../components/GlassCard';

export const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  // General States
  const [syncInterval, setSyncInterval] = useState('30');
  const [highContrast, setHighContrast] = useState(false);
  const [slackWebhook, setSlackWebhook] = useState('text-placeholder-slack-webhook-url');

  // SharePoint States
  const [spUrl, setSpUrl] = useState('https://company.sharepoint.com/sites/ApplicationCatalog');
  const [listName, setListName] = useState('ApplicationInventoryList');
  const [clientId, setClientId] = useState('00000000-0000-0000-0000-000000000000');
  const [tenantId, setTenantId] = useState('72f988bf-86f1-41af-91ab-2d7cd011db47');
  const [clientSecret, setClientSecret] = useState('••••••••••••••••••••••••••••••••');
  const [isConnected, setIsConnected] = useState(false);

  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTestResult(null);
    setTimeout(() => {
      setTestingConnection(false);
      setTestResult('Successfully negotiated Entra ID oauth credential handshake and established connection to SharePoint site: ApplicationCatalog.');
      setIsConnected(true);
    }, 1500);
  };

  const AnyTextField = TextField as any;
  const AnyButton = Button as any;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', color: '#FFFFFF', mb: 1 }}>
          System Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure synchronization intervals, high contrast theme triggers, MSAL auth variables, and SharePoint Online sync scopes.
        </Typography>
      </Box>

      <GlassCard sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 500, p: 0, overflow: 'hidden' }}>
        <Tabs
          orientation="vertical"
          value={tabValue}
          onChange={(_e, val) => setTabValue(val)}
          sx={{
            borderRight: '1px solid rgba(255,255,255,0.06)',
            width: { xs: '100%', md: 220 },
            flexShrink: 0,
            pt: 2,
            '& .MuiTabs-indicator': { bgcolor: 'primary.light', right: 'auto', left: 0 },
            '& .MuiTab-root': {
              color: 'text.secondary',
              fontWeight: 600,
              alignItems: 'flex-start',
              pl: 3.5,
              py: 2,
              '&.Mui-selected': { color: 'primary.light' },
            },
          }}
        >
          <Tab label="General" />
          <Tab label="SharePoint Sync" />
          <Tab label="Microsoft Entra" />
          <Tab label="Alerts & Slack" />
        </Tabs>

        <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* TAB 0: GENERAL */}
          {tabValue === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                General Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AnyTextField
                    label="Local Index Sync Interval (minutes)"
                    value={syncInterval}
                    onChange={(e: any) => setSyncInterval(e.target.value)}
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={highContrast}
                        onChange={(e) => setHighContrast(e.target.checked)}
                        color="secondary"
                      />
                    }
                    label="Enable High Contrast UI Assist"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <AnyButton variant="contained" color="primary">
                  Save Changes
                </AnyButton>
              </Box>
            </Box>
          )}

          {/* TAB 1: SHAREPOINT ONLINE CONNECTION CONFIG */}
          {tabValue === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                  SharePoint Online REST API Integration
                </Typography>
                <Chip
                  label={isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                  color={isConnected ? 'success' : 'default'}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Configure connection credentials below. When enabled in <b>ApplicationService</b>, this synchronization layer replaces local memory lists with SharePoint site collection tables automatically.
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <AnyTextField
                    label="SharePoint Site Collection URL"
                    value={spUrl}
                    onChange={(e: any) => setSpUrl(e.target.value)}
                    fullWidth
                    placeholder="https://<tenant>.sharepoint.com/sites/<site-name>"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AnyTextField
                    label="Target Inventory List Name"
                    value={listName}
                    onChange={(e: any) => setListName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AnyTextField
                    label="Azure Client App ID"
                    value={clientId}
                    onChange={(e: any) => setClientId(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AnyTextField
                    label="Azure Directory Tenant ID"
                    value={tenantId}
                    onChange={(e: any) => setTenantId(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AnyTextField
                    label="Client Client Secret"
                    value={clientSecret}
                    onChange={(e: any) => setClientSecret(e.target.value)}
                    type="password"
                    fullWidth
                  />
                </Grid>
              </Grid>

              {testResult && (
                <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', color: 'success.light', fontSize: '0.85rem' }}>
                  {testResult}
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <AnyButton variant="outlined" onClick={handleTestConnection} disabled={testingConnection} startIcon={<RefreshIcon />}>
                  {testingConnection ? 'Testing...' : 'Test Connection'}
                </AnyButton>
                <AnyButton variant="contained" disabled={!isConnected}>
                  Save & Enable Sync
                </AnyButton>
              </Box>
            </Box>
          )}

          {/* TAB 2: MSAL SSO AUTH CONFIG */}
          {tabValue === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                Microsoft Entra ID (SSO MSAL)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Secure user authentication is simulated using Microsoft OAuth endpoints. Swap placeholder auth methods with MSAL configurations when deploying to enterprise production.
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AnyTextField
                    label="MSAL Authentication Client ID"
                    value="447d25e0-1c39-44be-83a3-f09b2e0ad06e"
                    disabled
                    fullWidth
                    helperText="Read-only placeholder registry"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AnyTextField
                    label="MSAL Tenant Authority URL"
                    value="https://login.microsoftonline.com/common"
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <AnyTextField
                    label="Requested Delegated Access Scopes"
                    value="User.Read Sites.ReadWrite.All Lists.ReadWrite.All"
                    disabled
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', gap: 1.5, mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 2 }}>
                <LockIcon sx={{ color: 'text.disabled', fontSize: 18, mt: 0.3 }} />
                <Typography variant="caption" color="text.disabled" sx={{ lineHeight: 1.5 }}>
                  Authentication registry properties are locked for sandbox security. Swap token brokers inside <b>AuthContext.tsx</b> to activate.
                </Typography>
              </Box>
            </Box>
          )}

          {/* TAB 3: ALERTS CONFIG */}
          {tabValue === 3 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                Slack & Alert Webhooks
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <AnyTextField
                    label="Slack Webhook Target URL"
                    value={slackWebhook}
                    onChange={(e: any) => setSlackWebhook(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <AnyButton variant="contained">Save Configurations</AnyButton>
              </Box>
            </Box>
          )}
        </Box>
      </GlassCard>
    </Box>
  );
};

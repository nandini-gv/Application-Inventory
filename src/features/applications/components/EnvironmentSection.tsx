import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { EnvironmentCard } from './EnvironmentCard';
import { MASTER_DATA } from '../../../shared/config/masterData';

export const EnvironmentSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_e, val) => setActiveTab(val)}
        sx={{
          mb: 3,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          '& .MuiTabs-indicator': { bgcolor: 'primary.light' },
          '& .MuiTab-root': {
            color: 'text.secondary',
            fontWeight: 600,
            '&.Mui-selected': { color: 'primary.light' },
          },
        }}
      >
        {MASTER_DATA.ENVIRONMENTS.map((env) => (
          <Tab label={env} key={env} />
        ))}
      </Tabs>
      <EnvironmentCard envName={MASTER_DATA.ENVIRONMENTS[activeTab]} />
    </Box>
  );
};

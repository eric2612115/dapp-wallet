// components/portfolio/WalletTabs.tsx
import React from 'react';
import { Box, Tab, Tabs, useTheme } from '@mui/material';

interface WalletTabsProps {
  tabValue: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const WalletTabs: React.FC<WalletTabsProps> = ({ tabValue, handleTabChange }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs 
        TabIndicatorProps={{
          style: {
            backgroundColor: theme.palette.primary.main,
            height: 3
          }
        }} 
        onChange={handleTabChange}
        value={tabValue}
      >
        <Tab 
          label="Personal Wallet" 
          sx={{ 
            fontWeight: tabValue === 0 ? 600 : 400,
            color: tabValue === 0 ? theme.palette.primary.main : theme.palette.text.primary
          }}
        />
        <Tab 
          label="Multi-Signature Wallet" 
          sx={{ 
            fontWeight: tabValue === 1 ? 600 : 400,
            color: tabValue === 1 ? theme.palette.primary.main : theme.palette.text.primary
          }}
        />
      </Tabs>
    </Box>
  );
};

export default WalletTabs;
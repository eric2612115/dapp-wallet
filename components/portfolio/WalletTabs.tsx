// components/portfolio/WalletTabs.tsx
import React from 'react';
import { Tabs, TabList, TabTrigger } from '@/components/ui/Tabs';

interface WalletTabsProps {
  tabValue: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const WalletTabs: React.FC<WalletTabsProps> = ({ tabValue, handleTabChange }) => {
  return (
    <Tabs className="mb-6">
      <TabList>
        <TabTrigger
          value="personal"
          isActive={tabValue === 0}
          onClick={(e) => handleTabChange(e, 0)}
        >
          PERSONAL WALLET
        </TabTrigger>
        <TabTrigger
          value="multisig"
          isActive={tabValue === 1}
          onClick={(e) => handleTabChange(e, 1)}
        >
          MULTI-SIGNATURE WALLET
        </TabTrigger>
      </TabList>
    </Tabs>
  );
};

export default WalletTabs;
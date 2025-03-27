'use client';

import React from 'react';
import { WalletProvider } from '@/contexts/WalletContext';
import WhitelistManager from '@/components/whitelist/WhitelistManager';
import AlertContainer from '@/components/shared/AlertContainer';

const WhitelistPage = () => {
  return (
    <WalletProvider>
      <WhitelistManager />
      <AlertContainer />
    </WalletProvider>
  );
};

export default WhitelistPage;
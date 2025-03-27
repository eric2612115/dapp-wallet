'use client';

import React from 'react';
import { WalletProvider } from '@/contexts/WalletContext';
import DAppBrowserView from '@/components/dapps/DAppBrowserView';
import AlertContainer from '@/components/shared/AlertContainer';

const DAppBrowserPage = () => {
  return (
    <WalletProvider>
      <DAppBrowserView />
      <AlertContainer />
    </WalletProvider>
  );
};

export default DAppBrowserPage;
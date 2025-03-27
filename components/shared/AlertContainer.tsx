'use client';

import React from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { Alert } from '@/components/ui/Alert';

const AlertContainer = () => {
  const { alerts, removeAlert } = useWalletContext();
  
  if (alerts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.type}
          title={alert.title}
          onClose={() => removeAlert(alert.id)}
          className="shadow-lg"
        >
          {alert.message}
        </Alert>
      ))}
    </div>
  );
};

export default AlertContainer;
// components/shared/ApprovalButton.tsx
'use client';

import React, { useState } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { Bell as BellIcon } from 'lucide-react';
import ApprovalSidebar from './ApprovalSidebar';

const ApprovalButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { isConnected } = useWalletContext();
  
  // 為了避免 TypeScript 錯誤，我們暫時使用一個硬編碼的值或從本地 state 獲取
  // 之後可以通過 API 或其他方式獲取真實的待批准數量
  const pendingApprovalsCount = 3;

  if (!isConnected) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-md text-warm-text dark:text-gray-300 hover:bg-warm-bg dark:hover:bg-dark-100 focus:outline-none"
        aria-label="Pending approvals"
      >
        <BellIcon className="h-5 w-5" />
        {pendingApprovalsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-warm-primary text-white rounded-full flex items-center justify-center text-xs min-w-5 h-5 px-1">
            {pendingApprovalsCount}
          </span>
        )}
      </button>
      
      {/* Approval Sidebar */}
      <ApprovalSidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ApprovalButton;
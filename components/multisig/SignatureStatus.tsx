'use client';

import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { Check as CheckIcon, Clock as ClockIcon } from 'lucide-react';

interface Signer {
  address: string;
  name?: string;
  hasSigned?: boolean;
}

interface SignatureStatusProps {
  requiredSignatures: number;
  totalSigners: number;
  signers: Signer[];
}

const SignatureStatus: React.FC<SignatureStatusProps> = ({
  requiredSignatures,
  signers
}) => {
  // Count signed
  const signedCount = signers.filter(s => s.hasSigned).length;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-warm-text dark:text-white">
          {signedCount} of {requiredSignatures} required signatures
        </span>
        <Badge variant={signedCount >= requiredSignatures ? "success" : "warning"}>
          {signedCount >= requiredSignatures ? "Approved" : "Waiting"}
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {signers.map((signer, index) => (
          <div 
            key={signer.address}
            className="flex items-center gap-1 p-1 rounded-md border border-warm-divider dark:border-dark-100 bg-warm-paper dark:bg-dark-200"
          >
            <Avatar 
              initials={signer.name ? signer.name.charAt(0) : `S${index+1}`}
              size="xs" 
              className={signer.hasSigned 
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" 
                : "bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-300"} 
            />
            <span className="text-xs text-warm-textSecondary dark:text-gray-400">
              {signer.name || `Signer ${index+1}`}
            </span>
            {signer.hasSigned ? (
              <CheckIcon className="w-3 h-3 text-green-500 dark:text-green-400" />
            ) : (
              <ClockIcon className="w-3 h-3 text-yellow-500 dark:text-yellow-400" />
            )}
          </div>
        ))}
      </div>
      
      <div className="h-2 bg-warm-divider dark:bg-dark-100 rounded-full mt-2">
        <div 
          className="h-full rounded-full"
          style={{ 
            width: `${(signedCount / requiredSignatures) * 100}%`,
            backgroundColor: signedCount >= requiredSignatures ? '#10B981' : '#FBBF24'
          }}
        ></div>
      </div>
    </div>
  );
};

export default SignatureStatus;
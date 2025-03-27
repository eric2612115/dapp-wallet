// components/whitelist/AdvancedView.tsx
import React from 'react';
import ProtocolCard from './ProtocolCard';
import { Protocol } from '@/types/whitelist';

interface AdvancedViewProps {
  protocols: Protocol[];
  onToggleProtocolExpansion: (protocolName: string) => void;
  onToggleContractExpansion: (protocolName: string, contractAddress: string) => void;
  onToggleTokenWhitelist: (protocolName: string, tokenAddress: string) => void;
  onToggleFunctionWhitelist: (protocolName: string, contractAddress: string, functionName: string) => void;
}

const AdvancedView: React.FC<AdvancedViewProps> = ({ 
  protocols,
  onToggleProtocolExpansion,
  onToggleContractExpansion,
  onToggleTokenWhitelist,
  onToggleFunctionWhitelist
}) => {
  return (
    <div className="space-y-4">
      {protocols.length === 0 ? (
        <div className="text-center py-8 text-warm-textSecondary dark:text-gray-400">
          No protocols found matching your search
        </div>
      ) : (
        protocols.map((protocol) => (
          <ProtocolCard
            key={protocol.name}
            protocol={protocol}
            onToggleExpansion={() => onToggleProtocolExpansion(protocol.name)}
            onToggleContractExpansion={(contractAddress) => onToggleContractExpansion(protocol.name, contractAddress)}
            onToggleTokenWhitelist={(tokenAddress) => onToggleTokenWhitelist(protocol.name, tokenAddress)}
            onToggleFunctionWhitelist={(contractAddress, functionName) => 
              onToggleFunctionWhitelist(protocol.name, contractAddress, functionName)
            }
          />
        ))
      )}
    </div>
  );
};

export default AdvancedView;
// components/whitelist/ProtocolCard.tsx
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Check as CheckIcon, X as XIcon, ChevronDown as ChevronDownIcon } from 'lucide-react';
import ContractCard from './ContractCard';
import { Protocol } from '@/types/whitelist';

interface ProtocolCardProps {
  protocol: Protocol;
  onToggleExpansion: () => void;
  onToggleContractExpansion: (contractAddress: string) => void;
  onToggleTokenWhitelist: (tokenAddress: string) => void;
  onToggleFunctionWhitelist: (contractAddress: string, functionName: string) => void;
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({
  protocol,
  onToggleExpansion,
  onToggleContractExpansion,
  onToggleTokenWhitelist,
  onToggleFunctionWhitelist
}) => {
  return (
    <div className="border border-warm-divider dark:border-dark-100 rounded-lg overflow-hidden">
      {/* Protocol Header */}
      <div 
        className="p-4 bg-warm-bg dark:bg-dark-100 flex items-center justify-between cursor-pointer hover:bg-warm-bg/80 dark:hover:bg-dark-100/80"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center">
          <h3 className="font-medium text-lg text-warm-text dark:text-white">
            {protocol.name}
          </h3>
          <p className="ml-4 text-sm text-warm-textSecondary dark:text-gray-400">
            {protocol.description}
          </p>
        </div>
        <div className="flex items-center">
          <ChevronDownIcon 
            className={`h-5 w-5 text-warm-textSecondary dark:text-gray-400 transition-transform ${
              protocol.expanded ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </div>
      
      {/* Protocol Content */}
      {protocol.expanded && (
        <div className="p-4 border-t border-warm-divider dark:border-dark-100">
          {/* Tokens Section */}
          {protocol.tokens.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-warm-text dark:text-white mb-2">
                Tokens
              </h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {protocol.tokens.map((token) => (
                    <TableRow key={token.address}>
                      <TableCell className="font-medium">
                        {token.name}
                      </TableCell>
                      <TableCell>
                        {token.symbol}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">
                          {token.address.slice(0, 6)}...{token.address.slice(-4)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={token.whitelisted ? "success" : "default"}>
                          {token.whitelisted ? "Whitelisted" : "Not Whitelisted"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={token.whitelisted ? "outline" : "primary"}
                          size="sm"
                          onClick={() => onToggleTokenWhitelist(token.address)}
                          startIcon={token.whitelisted 
                            ? <XIcon className="w-4 h-4" /> 
                            : <CheckIcon className="w-4 h-4" />
                          }
                        >
                          {token.whitelisted ? "Remove" : "Whitelist"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Contracts Section */}
          {protocol.contracts.length > 0 && (
            <div>
              <h4 className="font-medium text-warm-text dark:text-white mb-2">
                Contracts & Functions
              </h4>
              <div className="space-y-4">
                {protocol.contracts.map((contract) => (
                  <ContractCard
                    key={contract.address}
                    contract={contract}
                    onToggleExpansion={() => onToggleContractExpansion(contract.address)}
                    onToggleFunctionWhitelist={(functionName) => onToggleFunctionWhitelist(contract.address, functionName)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProtocolCard;
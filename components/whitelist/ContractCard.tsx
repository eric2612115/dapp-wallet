// components/whitelist/ContractCard.tsx
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Check as CheckIcon, X as XIcon, ChevronDown as ChevronDownIcon, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { Contract } from '@/types/whitelist';

interface ContractCardProps {
  contract: Contract;
  onToggleExpansion: () => void;
  onToggleFunctionWhitelist: (functionName: string) => void;
}

const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  onToggleExpansion,
  onToggleFunctionWhitelist
}) => {
  return (
    <div className="border border-warm-divider dark:border-dark-100 rounded-lg overflow-hidden">
      {/* Contract Header */}
      <div 
        className="p-3 bg-warm-paper dark:bg-dark-200 flex items-center justify-between cursor-pointer hover:bg-warm-bg/60 dark:hover:bg-dark-100/60"
        onClick={onToggleExpansion}
      >
        <div>
          <h5 className="font-medium text-warm-text dark:text-white">
            {contract.name}
          </h5>
          <div className="flex items-center text-xs text-warm-textSecondary dark:text-gray-400">
            <span className="font-mono">{contract.address.slice(0, 6)}...{contract.address.slice(-4)}</span>
            <a 
              href={`https://etherscan.io/address/${contract.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-warm-primary dark:text-warm-primary hover:underline inline-flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              View on Etherscan
              <ExternalLinkIcon className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
        <ChevronDownIcon 
          className={`h-5 w-5 text-warm-textSecondary dark:text-gray-400 transition-transform ${
            contract.expanded ? 'transform rotate-180' : ''
          }`} 
        />
      </div>
      
      {/* Contract Functions */}
      {contract.expanded && (
        <div className="p-3 border-t border-warm-divider dark:border-dark-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Function</TableHead>
                <TableHead>Signature</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contract.functions.map((func) => (
                <TableRow key={func.name}>
                  <TableCell className="font-medium">
                    {func.name}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">
                      {func.signature}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-warm-textSecondary dark:text-gray-400">
                      {func.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={func.whitelisted ? "success" : "default"}>
                      {func.whitelisted ? "Whitelisted" : "Not Whitelisted"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={func.whitelisted ? "outline" : "primary"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFunctionWhitelist(func.name);
                      }}
                      startIcon={func.whitelisted 
                        ? <XIcon className="w-4 h-4" /> 
                        : <CheckIcon className="w-4 h-4" />
                      }
                    >
                      {func.whitelisted ? "Remove" : "Whitelist"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ContractCard;
// components/whitelist/BasicView.tsx
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Check as CheckIcon, X as XIcon } from 'lucide-react';
import { Token } from '@/types/whitelist';

interface BasicViewProps {
  tokens: Token[];
  onToggleWhitelist: (address: string) => void;
}

const BasicView: React.FC<BasicViewProps> = ({ tokens, onToggleWhitelist }) => {
  return (
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
        {tokens.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-warm-textSecondary dark:text-gray-400">
              No tokens found matching your search
            </TableCell>
          </TableRow>
        ) : (
          tokens.map((token) => (
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
                  onClick={() => onToggleWhitelist(token.address)}
                  startIcon={token.whitelisted 
                    ? <XIcon className="w-4 h-4" /> 
                    : <CheckIcon className="w-4 h-4" />
                  }
                >
                  {token.whitelisted ? "Remove" : "Whitelist"}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default BasicView;
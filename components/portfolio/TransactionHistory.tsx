// components/portfolio/TransactionHistory.tsx
import React, { useState } from 'react';
import { Launch as LaunchIcon } from '@mui/icons-material';
import { getTxExplorerUrl } from '../../lib/utils/explorerUtils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHead 
} from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';

import type { Transaction as TransactionType } from '@/types/transactions';

// Extend the imported type for component-specific needs
interface Transaction extends Omit<TransactionType, 'details'> {
  details?: string | Record<string, unknown>;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Helper to normalize status values
  const normalizeStatus = (status: string): 'pending' | 'completed' | 'failed' => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'success') return 'completed';
    if (statusLower === 'failed' || statusLower === 'error') return 'failed';
    if (statusLower === 'pending' || statusLower === 'processing') return 'pending';
    return 'completed'; // Default to completed
  };
  // components/portfolio/TransactionHistory.tsx (continued)

  // Helper to shorten addresses
  const shortenAddress = (address: string): string => {
    if (!address || address.length < 8) return address;
    // Check if it's likely an address (has 0x prefix and is long enough)
    if (address.startsWith('0x') && address.length >= 10) {
      return `${address.substring(0, 5)}...${address.substring(address.length - 3)}`;
    }
    return address;
  };

  // Helper to format details for display
  const formatDetails = (details: string | Record<string, unknown> | undefined): string => {
    if (!details) return '';
    if (typeof details === 'string') return details;
    // If it's an object, try to extract meaningful information or stringify it
    if (typeof details === 'object') {
      return Object.entries(details)
        .filter(([key]) => ['description', 'memo', 'note', 'type'].includes(key))
        .map(([, value]) => `${value}`)
        .join(' ') || JSON.stringify(details).slice(0, 30) + '...';
    }
    return '';
  };

  // Calculate displayed rows based on pagination
  const displayedTransactions = transactions.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  );

  // Handle pagination change
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Chain</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              displayedTransactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip 
                      variant={
                        tx.type === 'Swap' ? 'info' : 
                        tx.type === 'Send' ? 'danger' : 
                        'success'
                      }
                      size="sm"
                    >
                      {tx.type}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        {formatDetails(tx.details) || (tx.type === 'Swap' ? 
                          `${shortenAddress(tx.from)} → ${shortenAddress(tx.to)}` : 
                          `${shortenAddress(tx.from)} → ${shortenAddress(tx.to)}`
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        {shortenAddress(tx.hash)}
                        <a 
                          href={getTxExplorerUrl(tx.hash, tx.chainIndex || '1')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          aria-label="View on blockchain explorer"
                        >
                          <LaunchIcon fontSize="inherit" />
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tx.chain && (
                      <Badge variant="default">
                        {tx.chain}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {tx.amount}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {tx.value}
                  </TableCell>
                  <TableCell className="text-right text-gray-500 dark:text-gray-400">
                    {typeof tx.timestamp === 'string' ? new Date(tx.timestamp).toLocaleTimeString() : tx.timestamp}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        normalizeStatus(tx.status) === 'completed' ? 'success' : 
                        normalizeStatus(tx.status) === 'failed' ? 'danger' : 
                        'warning'
                      }
                    >
                      {normalizeStatus(tx.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {transactions.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                Show
              </span>
              <select
                className="text-sm border-gray-300 dark:border-dark-100 rounded-md bg-white dark:bg-dark-300 text-gray-700 dark:text-gray-300"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">
                entries
              </span>
            </div>
            
            <div className="flex space-x-1">
              <Button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                variant="default"
                size="sm"
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.ceil(transactions.length / rowsPerPage) }).map((_, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleChangePage(idx)}
                  variant={page === idx ? "primary" : "default"}
                  size="sm"
                >
                  {idx + 1}
                </Button>
              ))}
              
              <Button
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= Math.ceil(transactions.length / rowsPerPage) - 1}
                variant="default"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
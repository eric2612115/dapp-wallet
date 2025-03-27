// components/portfolio/AssetTable.tsx
import React, { useState } from 'react';
import {
  Add as AddIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  SwapHoriz as SwapIcon,
  CallMade as WithdrawIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHead 
} from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Chip from '@/components/ui/Chip';
import type { Asset } from '@/types/assets';

interface AssetTableProps {
  assets: Asset[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
  walletType?: 'personal' | 'multisig';
  onDeposit?: (asset: Asset) => void;
  onWithdraw?: (asset: Asset) => void;
  selectedWalletAddress?: string;
  selectedWalletName?: string;
}

const AssetTable: React.FC<AssetTableProps> = ({ 
  assets, 
  sortColumn, 
  sortDirection, 
  onSort, 
  walletType = 'personal',
  onDeposit,
  onWithdraw,
  selectedWalletName
}) => {
  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Fixed number of items per page
  
  // Calculate total pages
  const totalPages = Math.ceil(assets.length / itemsPerPage);

  // Handle pagination change
  const handlePageChange = (value: number) => {
    setPage(value);
  };

  // Calculate the current page's assets
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssets = assets.slice(startIndex, endIndex);

  // Title based on wallet type
  const title = walletType === 'personal'
    ? 'Personal Wallet Assets'
    : selectedWalletName
      ? `${selectedWalletName} Assets`
      : 'Multi-Signature Wallet Assets';
    
  // Subtitle based on wallet type
  const subtitle = walletType === 'personal'
    ? 'Assets in your personal wallet'
    : selectedWalletName
      ? `Assets in ${selectedWalletName}`
      : 'Assets in your multi-signature wallet';

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => onSort('name')} className="cursor-pointer">
                <div className="flex items-center">
                  Asset
                  {sortColumn === 'name' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" className="ml-1" /> : 
                      <ArrowDownwardIcon fontSize="small" className="ml-1" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => onSort('chain')} className="cursor-pointer">
                <div className="flex items-center">
                  Chain
                  {sortColumn === 'chain' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" className="ml-1" /> : 
                      <ArrowDownwardIcon fontSize="small" className="ml-1" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => onSort('balance')} className="cursor-pointer text-right">
                <div className="flex items-center justify-end">
                  Balance
                  {sortColumn === 'balance' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" className="ml-1" /> : 
                      <ArrowDownwardIcon fontSize="small" className="ml-1" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => onSort('price')} className="cursor-pointer text-right">
                <div className="flex items-center justify-end">
                  Price
                  {sortColumn === 'price' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" className="ml-1" /> : 
                      <ArrowDownwardIcon fontSize="small" className="ml-1" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => onSort('value')} className="cursor-pointer text-right">
                <div className="flex items-center justify-end">
                  Value
                  {sortColumn === 'value' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" className="ml-1" /> : 
                      <ArrowDownwardIcon fontSize="small" className="ml-1" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => onSort('change24h')} className="cursor-pointer text-right">
                <div className="flex items-center justify-end">
                  24h Change
                  {sortColumn === 'change24h' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" className="ml-1" /> : 
                      <ArrowDownwardIcon fontSize="small" className="ml-1" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No assets found
                </TableCell>
              </TableRow>
            ) : (
              currentAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar 
                        src={asset.logoUrl}
                        initials={asset.symbol.substring(0, 1)}
                        size="sm"
                        className="mr-3"
                      />
                      <div>
                        <div className="flex items-center">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {asset.name}
                          </div>
                          {/* For multisig wallet: show whitelist status */}
                          {walletType === 'multisig' && (
                            <div className="ml-2">
                              {asset.isWhitelisted ? (
                                <Chip 
                                  size="sm"
                                  variant="success"
                                >
                                  Whitelisted
                                </Chip>
                              ) : (
                                <WarningIcon 
                                  className="text-yellow-500 dark:text-yellow-400"
                                  fontSize="small"
                                  titleAccess="Non-whitelisted token: requires additional approvals to withdraw"
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {asset.chain && (
                      <Badge variant="default">
                        {asset.chain}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {asset.symbol}
                  </TableCell>
                  <TableCell className="text-right">
                    ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${asset.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={asset.change24h > 0 ? 'success' : asset.change24h < 0 ? 'danger' : 'default'}
                    >
                      {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2">
                      {/* Different actions based on wallet type */}
                      {walletType === 'personal' ? (
                        // Personal wallet: Swap and Deposit buttons
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            startIcon={<SwapIcon />}
                          >
                            Swap
                          </Button>
                          {onDeposit && (
                            <Button 
                              onClick={() => onDeposit(asset)}
                              variant="outline" 
                              size="sm"
                              startIcon={<AddIcon />}
                            >
                              Deposit
                            </Button>
                          )}
                        </>
                      ) : (
                        // Multi-signature wallet: Withdraw button
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            startIcon={<SwapIcon />}
                          >
                            Swap
                          </Button>
                          {onWithdraw && (
                            <Button 
                              onClick={() => onWithdraw(asset)}
                              variant="outline" 
                              size="sm"
                              startIcon={<WithdrawIcon />}
                            >
                              Withdraw
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {assets.length > 0 && (
          <div className="px-6 py-4 flex justify-center">
            <div className="flex space-x-1">
              <Button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                variant="default"
                size="sm"
              >
                First
              </Button>
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                variant="default"
                size="sm"
              >
                Prev
              </Button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (page <= 3) {
                  pageNum = idx + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = page - 2 + idx;
                }
                
                return (
                  <Button
                    key={idx}
                    onClick={() => handlePageChange(pageNum)}
                    variant={page === pageNum ? "primary" : "default"}
                    size="sm"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                variant="default"
                size="sm"
              >
                Next
              </Button>
              <Button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                variant="default"
                size="sm"
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetTable;
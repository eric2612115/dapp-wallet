// components/portfolio/AssetControls.tsx
import React from 'react';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface AssetControlsProps {
  search: string;
  setSearch: (search: string) => void;
  refreshing: boolean;
  handleRefresh: () => void;
  handleDepositOpen: () => void;
}

const AssetControls: React.FC<AssetControlsProps> = ({
  search,
  setSearch,
  refreshing,
  handleRefresh,
  handleDepositOpen
}) => {
  return (
    <div className="flex justify-between items-center mb-4 flex-col sm:flex-row gap-3">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search assets..."
        startIcon={<SearchIcon className="h-5 w-5 text-gray-400" />}
        className="max-w-xs"
      />

      <div className="flex gap-2">
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="ghost"
          size="md"
          className="p-2"
          aria-label="Refresh assets"
        >
          {refreshing ? (
            <svg className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <RefreshIcon className="h-5 w-5" />
          )}
        </Button>
        
        <Button 
          variant="default"
          startIcon={<FilterListIcon />}
        >
          Filter
        </Button>
        
        <Button 
          onClick={handleDepositOpen}
          variant="primary"
          startIcon={<AddIcon />}
        >
          Deposit
        </Button>
      </div>
    </div>
  );
};

export default AssetControls;
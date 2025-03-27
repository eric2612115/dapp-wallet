// components/portfolio/AssetControls.tsx
import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';

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
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}
    >
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search assets..."
        size="small"
        sx={{ 
          flexGrow: 1, 
          maxWidth: { xs: '100%', sm: 300 },
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
        value={search}
        variant="outlined"
      />
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton 
          disabled={refreshing}
          onClick={handleRefresh}
          size="small"
          sx={{ 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            p: 1
          }}
        >
          {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
        </IconButton>
        
        <Button 
          startIcon={<FilterListIcon />} 
          sx={{ borderRadius: 2 }}
          variant="outlined"
        >
          Filter
        </Button>
        
        <Button 
          color="primary" 
          onClick={handleDepositOpen}
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
          variant="contained"
        >
          Deposit
        </Button>
      </Box>
    </Box>
  );
};

export default AssetControls;
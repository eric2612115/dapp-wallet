// components/portfolio/MultisigWalletSelector.tsx
import React from 'react';
import { 
  Alert, 
  Box, 
  CircularProgress, 
  TextField, 
  Typography 
} from '@mui/material';
import type { MultisigWallet } from '@/types/assets';

interface MultisigWalletSelectorProps {
  isLoadingWallets: boolean;
  walletsError: Error | null;
  relatedMultisigWallets: MultisigWallet[];
  selectedMultisigWalletAddress: string;
  handleMultisigWalletChange: (walletAddress: string) => void;
}

const MultisigWalletSelector: React.FC<MultisigWalletSelectorProps> = ({
  isLoadingWallets,
  walletsError,
  relatedMultisigWallets,
  selectedMultisigWalletAddress,
  handleMultisigWalletChange
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {isLoadingWallets ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Loading wallets...</Typography>
        </Box>
      ) : walletsError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading multi-signature wallets. Please try again.
        </Alert>
      ) : relatedMultisigWallets.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No multi-signature wallets found. Create one to get started.
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ minWidth: 120 }} variant="body2">
            Select wallet:
          </Typography>
          <TextField
            SelectProps={{
              native: true,
            }}
            onChange={(e) => handleMultisigWalletChange(e.target.value)}
            select
            size="small"
            sx={{ 
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            value={selectedMultisigWalletAddress}
          >
            {relatedMultisigWallets.map((wallet) => (
              <option key={wallet.multisig_address} value={wallet.multisig_address}>
                {wallet.name}
              </option>
            ))}
          </TextField>
        </Box>
      )}
    </Box>
  );
};

export default MultisigWalletSelector;
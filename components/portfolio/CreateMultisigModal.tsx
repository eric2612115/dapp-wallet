// components/portfolio/CreateMultisigModal.tsx
import React, { useState } from 'react';
import {
  Box, Button, CircularProgress, Dialog, 
  DialogActions, DialogContent, DialogTitle, Typography,
  Alert, TextField
} from '@mui/material';
import { useAccount, useChainId } from 'wagmi';

interface CreateMultisigModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateMultisigModal: React.FC<CreateMultisigModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [walletName, setWalletName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateWallet = async () => {
    if (!address) {
      setError('Your wallet address is not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call the success callback
      onSuccess();
      
      // Close the modal
      handleClose();
    } catch (err) {
      console.error('Failed to create multi-sig wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setWalletName('');
    setError(null);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog 
      fullWidth 
      maxWidth="sm" 
      onClose={loading ? undefined : handleClose}
      open={open}
    >
      <DialogTitle>Create New Multi-signature Wallet</DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            disabled={loading}
            fullWidth
            label="Wallet Name"
            margin="normal"
            onChange={(e) => setWalletName(e.target.value)}
            placeholder="My Multi-sig Wallet"
            value={walletName}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will create a new multi-signature wallet where you and your AI assistant
            both have control. All transactions from this wallet will require approval.
          </Typography>

          {/* Chain info */}
          <Box 
            sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="subtitle2">Wallet Details</Typography>
            <Typography variant="body2" color="text.secondary">
              Network: {chainId ? 
                chainId === 1 ? 'Ethereum Mainnet' : 
                chainId === 137 ? 'Polygon' : 
                chainId === 56 ? 'BNB Smart Chain' : 
                `Chain ID: ${chainId}` : 'Unknown'
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Owner: {address ? 
                `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 
                'Not connected'
              }
            </Typography>
          </Box>

          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          disabled={loading} 
          onClick={handleClose} 
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          disabled={loading || !address} 
          onClick={handleCreateWallet} 
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Create Wallet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMultisigModal;
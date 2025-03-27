// components/portfolio/WithdrawHandler.tsx
import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  CallMade as WithdrawIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useWithdraw } from '@/lib/hooks/useWithdraw';
import type { Asset } from '@/types/assets';

interface WithdrawHandlerProps {
  asset: Asset;
  multisigWalletAddress: string;
  walletName: string;
  onSuccess: (message: string) => void;
}

const WithdrawHandler: React.FC<WithdrawHandlerProps> = ({
  asset,
  multisigWalletAddress,
  walletName,
  onSuccess
}) => {
  const [open, setOpen] = useState(false);
  const { withdrawing, withdrawError, handleWithdraw } = useWithdraw();
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleSubmit = async () => {
    await handleWithdraw(
      asset,
      multisigWalletAddress,
      walletName,
      (message: string) => {
        onSuccess(message);
        handleClose();
      }
    );
  };
  
  return (
    <>
      <Button 
        color="warning" 
        onClick={handleOpen}
        size="small"
        startIcon={<WithdrawIcon />}
        sx={{ borderRadius: 1.5 }}
        variant="outlined"
      >
        Withdraw
      </Button>
      
      <Dialog open={open} onClose={!withdrawing ? handleClose : undefined} maxWidth="xs" fullWidth>
        <DialogTitle>
          Withdraw {asset.symbol}
          <Button
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            disabled={withdrawing}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom variant="body1">
            You are about to withdraw:
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {asset.balance} {asset.symbol} (${asset.value.toLocaleString()})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This asset will be withdrawn from {walletName} to your personal wallet.
            {!asset.isWhitelisted && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                This token is not whitelisted. The withdrawal may require additional approval from other wallet owners.
              </Alert>
            )}
          </Typography>
          {withdrawError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {withdrawError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={withdrawing}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
            disabled={withdrawing}
            startIcon={withdrawing ? <CircularProgress size={20} /> : null}
          >
            {withdrawing ? 'Processing...' : 'Confirm Withdrawal'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WithdrawHandler;
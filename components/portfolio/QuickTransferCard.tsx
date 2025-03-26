// components/portfolio/QuickTransferCard.tsx
import React, { useState } from 'react';
import {
  alpha, Box, Button, Card, CardContent, Divider,
  Grid, Radio, TextField, Typography, useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';

// Available tokens interface
interface TokenInfo {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  tokenAddress?: string;
  decimals?: number;
  chain: string;
  chainId: number;
}

// Multisig wallet interface
interface MultisigWallet {
  name: string;
  multisig_address: string;
  chain: string;
  chainId: number;
}

interface QuickTransferCardProps {
  userWalletAddress: string;
  userWalletName?: string;
  totalBalance: number;
  availableTokens: TokenInfo[];
  relatedWallets: MultisigWallet[];
  onTransfer: (data: { token: string; amount: string; recipient: string }) => void;
  onCreateMultisig?: () => void;
  isLoadingWallets?: boolean;
}

const QuickTransferCard: React.FC<QuickTransferCardProps> = ({
  userWalletAddress,
  userWalletName = 'My Wallet',
  totalBalance,
  availableTokens,
  relatedWallets,
  onTransfer,
  onCreateMultisig
}) => {
  const theme = useTheme();
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // Format wallet addresses for display
  const formatAddress = (address: string): string => {
    if (!address || address.length < 8) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle submit
  const handleSubmit = () => {
    if (selectedRecipient && selectedToken && transferAmount) {
      onTransfer({
        token: selectedToken,
        amount: transferAmount,
        recipient: selectedRecipient
      });
      setTransferAmount('');
    }
  };

  return (
    <Card
      sx={{
        mb: 4,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Grid container>
          {/* Left side - Sender wallet */}
          <Grid
            item
            md={4}
            sm={5}
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              borderRight: { xs: 'none', sm: `1px solid ${theme.palette.divider}` },
              borderBottom: { xs: `1px solid ${theme.palette.divider}`, sm: 'none' }
            }}
            xs={12}
          >
            <Box sx={{ mb: 3 }}>
              <Typography color="text.secondary" gutterBottom variant="subtitle2">
                From
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                  }}
                >
                  <WalletIcon color="primary" />
                </Box>
                <Box>
                  <Typography fontWeight={600} variant="subtitle1">
                    {userWalletName}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {formatAddress(userWalletAddress)}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  mt: 2,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography color="text.secondary" variant="caption">
                  Total Balance
                </Typography>
                <Typography fontWeight={600} sx={{ mt: 0.5 }} variant="h5">
                  ${totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Basic token selection dropdown */}
            <TextField
              select
              fullWidth
              label="Select Token"
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              sx={{ mb: 2 }}
              SelectProps={{ native: true }}
            >
              <option value="">Select a token</option>
              {availableTokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol} - Balance: {token.balance}
                </option>
              ))}
            </TextField>

            {/* Transfer amount */}
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              disabled={!selectedToken}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Middle arrow - only displayed on tablet and desktop */}
          <Grid
            item
            md={1}
            sm={2}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <ArrowForwardIcon color="primary" />
            </Box>
          </Grid>

          {/* Right side - Recipient wallet selection */}
          <Grid item md={7} sm={5} sx={{ p: 3 }} xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography color="text.secondary" gutterBottom variant="subtitle2">
                To
              </Typography>

              {/* Simplified recipient selection */}
              {relatedWallets.length === 0 ? (
                <Box
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: alpha(theme.palette.warning.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                  }}
                >
                  <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
                    No related wallets found. You need to create a multi-signature wallet first.
                  </Typography>
                  <Button
                    color="primary"
                    onClick={onCreateMultisig}
                    startIcon={<AddIcon />}
                    variant="outlined"
                  >
                    New Multi-sig Wallet
                  </Button>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 240, overflow: 'auto' }}>
                  {relatedWallets.map((wallet) => (
                    <Box
                      key={wallet.multisig_address}
                      onClick={() => setSelectedRecipient(wallet.multisig_address)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        mb: 1,
                        borderRadius: 2,
                        border: `1px solid ${
                          selectedRecipient === wallet.multisig_address
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`,
                        bgcolor: selectedRecipient === wallet.multisig_address
                          ? alpha(theme.palette.primary.main, 0.05)
                          : 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <Radio
                        checked={selectedRecipient === wallet.multisig_address}
                        value={wallet.multisig_address}
                        name="recipient-radio-buttons"
                        sx={{ p: 0.5, mr: 1 }}
                      />
                      <Box>
                        <Typography fontWeight={600} variant="subtitle2">
                          {wallet.name}
                        </Typography>
                        <Typography color="text.secondary" variant="caption">
                          {wallet.chain} - {formatAddress(wallet.multisig_address)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Transfer button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                color="primary"
                disabled={!selectedRecipient || !selectedToken || !transferAmount || relatedWallets.length === 0}
                onClick={handleSubmit}
                size="large"
                startIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 2 }}
                variant="contained"
              >
                Transfer
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickTransferCard;
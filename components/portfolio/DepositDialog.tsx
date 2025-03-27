// components/portfolio/DepositDialog.tsx
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputAdornment,
  InputLabel, MenuItem, Select, SelectChangeEvent,
  TextField, Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme as useNextTheme } from 'next-themes';

// Available tokens list
const availableTokens = [
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'USDC', label: 'USD Coin (USDC)' },
  { value: 'LINK', label: 'Chainlink (LINK)' },
  { value: 'UNI', label: 'Uniswap (UNI)' },
  { value: 'AAVE', label: 'Aave (AAVE)' },
  { value: 'BTC', label: 'Bitcoin (BTC)' }
];

interface DepositDialogProps {
  open: boolean;
  walletType: 'personal' | 'multisig';
  preSelectedToken?: string;
  preSelectedAmount?: string;  // Add support for prefilled amount
  tokenBalances?: {[key: string]: number}; // Map of token symbols to balances
  selectedWalletName?: string; // Name of the selected multi-signature wallet
  onClose: () => void;
  onSubmit: (token: string, amount: string) => void;
}

const DepositDialog: React.FC<DepositDialogProps> = ({ 
  open, 
  walletType,
  preSelectedToken,
  preSelectedAmount,
  tokenBalances = {},
  selectedWalletName,
  onClose, 
  onSubmit 
}) => {
  const { theme: nextTheme, resolvedTheme } = useNextTheme();
  const [selectedToken, setSelectedToken] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Safely determine dark mode
  const isDarkMode = resolvedTheme === 'dark' || nextTheme === 'dark';

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set pre-selected token and amount if provided
  useEffect(() => {
    if (open) {
      if (preSelectedToken) {
        setSelectedToken(preSelectedToken);
      }
      
      if (preSelectedAmount) {
        setDepositAmount(preSelectedAmount);
      } else if (preSelectedToken && tokenBalances[preSelectedToken]) {
        // If token is preselected but no amount, use max balance
        setDepositAmount(tokenBalances[preSelectedToken].toString());
      }
    }
  }, [preSelectedToken, preSelectedAmount, tokenBalances, open]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Only reset if dialog is closed
      setSelectedToken('');
      setDepositAmount('');
      setIsLoading(false);
    }
  }, [open]);

  // Check if form is valid
  useEffect(() => {
    const amountIsValid = depositAmount.trim() !== '' && 
                          !isNaN(Number(depositAmount)) && 
                          Number(depositAmount) > 0;
    setIsValid(selectedToken !== '' && amountIsValid);
  }, [selectedToken, depositAmount]);

  const handleTokenChange = (event: SelectChangeEvent) => {
    setSelectedToken(event.target.value);
  };

  const handleClose = () => {
    setSelectedToken('');
    setDepositAmount('');
    setIsLoading(false);
    onClose();
  };

  const handleSubmit = () => {
    if (isValid) {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        onSubmit(selectedToken, depositAmount);
        setSelectedToken('');
        setDepositAmount('');
        setIsLoading(false);
      }, 1000);
    }
  };

  // Override the standard theme components to style the Menu properly
  const menuProps = {
    PaperProps: {
      style: {
        backgroundColor: isDarkMode ? '#121212' : '#F8EDD7', // Dark or warm-bg
        color: isDarkMode ? '#fff' : '#33281B', // White or warm-text
        border: `1px solid ${isDarkMode ? '#333' : '#E6D6A9'}`, // Dark border or warm-divider
      },
    },
    MenuListProps: {
      style: {
        padding: 0,
      },
    },
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <Dialog 
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: 3,
          bgcolor: isDarkMode ? '#121212' : '#F8EDD7', // Dark or warm-bg
          color: isDarkMode ? '#fff' : '#33281B', // White or warm-text
          border: `1px solid ${isDarkMode ? '#333' : '#E6D6A9'}`, // Dark border or warm-divider
        }
      }} 
      fullWidth 
      maxWidth="xs" 
      onClose={handleClose}
      open={open}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid ${isDarkMode ? '#333' : '#E6D6A9'}`, // Dark border or warm-divider
        bgcolor: isDarkMode ? '#121212' : '#F8EDD7', // Dark or warm-bg
        color: isDarkMode ? '#fff' : '#33281B', // White or warm-text
      }}>
        <Typography component="div" variant="h6" sx={{ 
          color: isDarkMode ? '#fff' : '#33281B',  // White or warm-text
          fontWeight: 500 
        }}>
          {walletType === 'personal' 
            ? 'Deposit to Personal Wallet' 
            : selectedWalletName 
              ? `Deposit to ${selectedWalletName}` 
              : 'Deposit to Multi-Signature Wallet'
          }
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: isDarkMode ? '#888' : '#7D6547', // Gray or warm-textSecondary
            '&:hover': {
              color: isDarkMode ? '#fff' : '#33281B' // White or warm-text on hover
            }
          }}
          disabled={isLoading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ 
        bgcolor: isDarkMode ? '#121212' : '#F8EDD7', // Dark or warm-bg
        color: isDarkMode ? '#fff' : '#33281B', // White or warm-text
        py: 3 
      }}>
        <Box sx={{ pt: 1 }}>
          {preSelectedToken ? (
            // If token is preselected, show readonly display
            <Box
              sx={{ 
                p: 2, 
                mb: 3, 
                border: `1px solid ${isDarkMode ? '#333' : '#E6D6A9'}`, // Dark border or warm-divider
                borderRadius: 1,
                bgcolor: isDarkMode ? '#1A1A1A' : '#F2E6C7', // Darker background or warm-paper
              }}
            >
              <Typography sx={{ 
                color: isDarkMode ? '#888' : '#7D6547' // Gray or warm-textSecondary
              }} variant="caption">
                Token
              </Typography>
              <Typography fontWeight={500} variant="subtitle1" sx={{ 
                color: isDarkMode ? '#fff' : '#33281B' // White or warm-text
              }}>
                {preSelectedToken}
              </Typography>
            </Box>
          ) : (
            // Otherwise show dropdown
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="token-select-label" sx={{ 
                color: isDarkMode ? '#888' : '#7D6547' // Gray or warm-textSecondary
              }}>Select Token</InputLabel>
              <Select
                label="Select Token"
                labelId="token-select-label"
                onChange={handleTokenChange}
                value={selectedToken}
                disabled={isLoading}
                MenuProps={menuProps} // Apply custom menu props
                sx={{
                  color: isDarkMode ? '#fff' : '#33281B', // White or warm-text
                  bgcolor: isDarkMode ? '#1A1A1A' : '#F2E6C7', // Darker background or warm-paper
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#333' : '#E6D6A9', // Dark border or warm-divider
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#555' : '#D4A76A', // Lighter dark border or warm-secondary
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#B07941', // warm-primary for both themes
                  },
                  '& .MuiSelect-icon': {
                    color: isDarkMode ? '#888' : '#7D6547', // Gray or warm-textSecondary
                  }
                }}
              >
                {availableTokens.map((token) => (
                  <MenuItem 
                    key={token.value} 
                    value={token.value}
                    sx={{
                      backgroundColor: isDarkMode ? '#121212' : '#F8EDD7', // Dark or warm-bg
                      color: isDarkMode ? '#fff' : '#33281B', // White or warm-text
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#2A2A2A' : '#F2E6C7', // Hover bg dark or warm-paper
                      },
                      '&.Mui-selected': {
                        backgroundColor: isDarkMode ? '#333' : '#F2E6C7', // Selected bg dark or warm-paper
                        '&:hover': {
                          backgroundColor: isDarkMode ? '#3A3A3A' : '#E6D6A9', // Hover selected bg dark or warm-divider
                        }
                      }
                    }}
                  >
                    {token.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          <TextField
            InputProps={{
              endAdornment: selectedToken || preSelectedToken ? (
                <InputAdornment position="end">
                  {/* Add max button */}
                  {!preSelectedAmount && !isLoading && (
                    <Button 
                      onClick={() => {
                        const token = preSelectedToken || selectedToken;
                        if (token && tokenBalances[token]) {
                          setDepositAmount(tokenBalances[token].toString());
                        }
                      }} 
                      size="small"
                      sx={{ 
                        mr: 1, 
                        fontSize: '0.75rem',
                        color: '#B07941' // warm-primary for both themes
                      }}
                    >
                      MAX
                    </Button>
                  )}
                  <span style={{ 
                    color: isDarkMode ? '#fff' : '#33281B' // White or warm-text
                  }}>
                    {preSelectedToken || selectedToken}
                  </span>
                </InputAdornment>
              ) : null,
            }}
            fullWidth
            label="Amount"
            onChange={(e) => setDepositAmount(e.target.value)}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: isDarkMode ? '#fff' : '#33281B', // White or warm-text
                bgcolor: isDarkMode ? '#1A1A1A' : '#F2E6C7', // Darker background or warm-paper
                '& fieldset': {
                  borderColor: isDarkMode ? '#333' : '#E6D6A9', // Dark border or warm-divider
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? '#555' : '#D4A76A', // Lighter dark border or warm-secondary
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#B07941', // warm-primary for both themes
                },
              },
              '& .MuiInputLabel-root': {
                color: isDarkMode ? '#888' : '#7D6547', // Gray or warm-textSecondary
              },
              '& .MuiInputBase-input': {
                color: isDarkMode ? '#fff' : '#33281B', // White or warm-text
              }
            }}
            type="number"
            value={depositAmount}
            variant="outlined"
            disabled={isLoading}
          />
          
          <Typography sx={{ 
            mb: 2, 
            color: isDarkMode ? '#888' : '#7D6547' // Gray or warm-textSecondary
          }} variant="body2">
            {walletType === 'personal'
              ? 'Deposit your tokens to your personal wallet. The transaction will be processed on the blockchain.'
              : 'Deposit your tokens to the multi-signature wallet. The transaction will require additional approvals before execution.'}
          </Typography>

          {walletType === 'multisig' && (
            <Box
              sx={{
                p: 2,
                bgcolor: isDarkMode ? '#1A1A1A' : '#F2E6C7', // Darker background or warm-paper
                borderRadius: 1,
                border: `1px solid ${isDarkMode ? '#333' : '#E6D6A9'}`, // Dark border or warm-divider
              }}
            >
              <Typography sx={{ 
                color: isDarkMode ? '#888' : '#7D6547' // Gray or warm-textSecondary
              }} variant="caption">
                <strong>Note:</strong> Funds deposited to a multi-signature wallet require multiple signatures to withdraw. Make sure you understand the wallet&apos;s security policy before proceeding.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        bgcolor: isDarkMode ? '#121212' : '#F8EDD7', // Dark or warm-bg
        borderTop: `1px solid ${isDarkMode ? '#333' : '#E6D6A9'}`, // Dark border or warm-divider
      }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            borderRadius: 1,
            color: isDarkMode ? '#fff' : '#33281B', // White or warm-text
            border: `1px solid ${isDarkMode ? '#333' : '#E6D6A9'}`, // Dark border or warm-divider
            '&:hover': {
              borderColor: '#B07941', // warm-primary for both themes
              backgroundColor: 'rgba(176, 121, 65, 0.1)' // semi-transparent warm-primary for both themes
            }
          }} 
          variant="outlined"
          disabled={isLoading}
        >
          CANCEL
        </Button>
        <Button 
          disabled={!isValid || isLoading} 
          onClick={handleSubmit} 
          sx={{ 
            borderRadius: 1,
            backgroundColor: '#B07941', // warm-primary for both themes
            color: '#fff', // White text for both themes for better contrast
            '&:hover': {
              backgroundColor: '#916435' // Darker warm-primary for both themes
            }
          }}
          variant="contained"
        >
          {isLoading ? 'Processing...' : 'DEPOSIT'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepositDialog;
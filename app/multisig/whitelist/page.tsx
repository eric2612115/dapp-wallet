'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WalletProvider, useWalletContext } from '@/contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { 
  ChevronLeft as ChevronLeftIcon, 
  Plus as PlusIcon, 
  Search as SearchIcon,
  Check as CheckIcon,
  X as XIcon,
  Shield as ShieldIcon
} from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import AlertContainer from '@/components/shared/AlertContainer';

// Mock token data
const mockTokens = [
  { symbol: 'ETH', name: 'Ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', whitelisted: true },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', whitelisted: true },
  { symbol: 'LINK', name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', whitelisted: false },
  { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', whitelisted: false },
  { symbol: 'AAVE', name: 'Aave', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', whitelisted: false },
];

// Main container component with provider
const WhitelistPage = () => {
  return (
    <WalletProvider>
      <WhitelistManager />
      <AlertContainer />
    </WalletProvider>
  );
};

// Main whitelist manager component using wallet context
const WhitelistManager = () => {
  const { isConnected, mounted, relatedMultisigWallets, selectedMultisigWalletAddress, setSelectedMultisigWalletAddress, addAlert } = useWalletContext();
  const router = useRouter();
  
  // State for the whitelist functionality
  const [search, setSearch] = useState('');
  const [tokens, setTokens] = useState(mockTokens);
  const [addTokenModalOpen, setAddTokenModalOpen] = useState(false);
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAddingToWhitelist, setIsAddingToWhitelist] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState<{
    symbol: string;
    name: string;
    address: string;
    decimals?: number;
  } | null>(null);
  
  // Find the selected wallet
  const selectedWallet = relatedMultisigWallets.find(wallet => 
    wallet.multisig_address === selectedMultisigWalletAddress
  );
  
  // Handle wallet selection change
  const handleWalletChange = (value: string) => {
    setSelectedMultisigWalletAddress(value);
  };
  
  // Create options for the wallet selector
  const walletOptions = relatedMultisigWallets.map(wallet => ({
    value: wallet.multisig_address,
    label: `${wallet.name} (${wallet.requiredSignatures}/${wallet.totalSigners})`
  }));
  
  // Filter tokens by search term
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(search.toLowerCase()) || 
    token.symbol.toLowerCase().includes(search.toLowerCase()) ||
    token.address.toLowerCase().includes(search.toLowerCase())
  );
  
  // Toggle whitelist status of a token
  const toggleWhitelist = (address: string) => {
    setTokens(tokens.map(token => 
      token.address === address 
        ? { ...token, whitelisted: !token.whitelisted } 
        : token
    ));
    
    const token = tokens.find(t => t.address === address);
    if (token) {
      addAlert({
        type: 'success',
        title: token.whitelisted ? 'Token Removed' : 'Token Whitelisted',
        message: token.whitelisted 
          ? `${token.symbol} has been removed from the whitelist.` 
          : `${token.symbol} has been added to the whitelist.`
      });
    }
  };
  
  // Verify token address
  const verifyTokenAddress = () => {
    if (!newTokenAddress) return;
    
    setIsVerifying(true);
    
    // Mock API call to verify token
    setTimeout(() => {
      // For demo, just pretend it's verified
      setVerifiedToken({
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        address: newTokenAddress,
        decimals: 18
      });
      setIsVerifying(false);
    }, 1500);
  };
  
  // Add token to whitelist
  const addTokenToWhitelist = () => {
    if (!verifiedToken) return;
    
    setIsAddingToWhitelist(true);
    
    // Mock API call to add token
    setTimeout(() => {
      setTokens([
        ...tokens,
        { ...verifiedToken, whitelisted: true }
      ]);
      
      addAlert({
        type: 'success',
        title: 'Token Added',
        message: `${verifiedToken.symbol} has been added to the whitelist.`
      });
      
      // Reset and close modal
      setVerifiedToken(null);
      setNewTokenAddress('');
      setAddTokenModalOpen(false);
      setIsAddingToWhitelist(false);
    }, 1500);
  };
  
  // Close the add token modal
  const closeAddTokenModal = () => {
    setAddTokenModalOpen(false);
    setVerifiedToken(null);
    setNewTokenAddress('');
  };
  
  // Show nothing when not mounted (to prevent hydration issues)
  if (!mounted) {
    return null;
  }
  
  if (!isConnected) {
    return (
      <div className="text-center py-8 flex flex-col items-center justify-center bg-warm-paper dark:bg-dark-200 rounded-lg border border-warm-divider dark:border-dark-100">
        <div className="bg-warm-bg dark:bg-warm-primary/30 text-warm-primary dark:text-warm-secondary w-16 h-16 flex items-center justify-center rounded-full mb-2">
          <ShieldIcon size={32} />
        </div>
        <h2 className="text-xl font-semibold text-warm-text dark:text-white mb-2">
          Please connect your wallet to manage whitelists
        </h2>
        <p className="text-warm-textSecondary dark:text-gray-400 max-w-md mb-6">
          Connect your wallet to configure token whitelists for your multi-signature wallets.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4"
          onClick={() => router.push('/multisig')}
          startIcon={<ChevronLeftIcon className="w-4 h-4" />}
        >
          Back to Wallets
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-warm-text dark:text-white">
            Token Whitelist Management
          </h1>
          <p className="text-warm-textSecondary dark:text-gray-300">
            Manage whitelisted tokens for simplified approvals
          </p>
        </div>
      </div>
      
      {/* Select wallet */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Wallet</CardTitle>
          <CardDescription>
            Choose a multi-signature wallet to manage its token whitelist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            options={walletOptions}
            value={selectedMultisigWalletAddress}
            onChange={handleWalletChange}
            placeholder="Select a multi-signature wallet"
            fullWidth
          />
        </CardContent>
      </Card>
      
      {selectedWallet ? (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <CardTitle>Whitelisted Tokens</CardTitle>
              <CardDescription>
                Tokens on this list can be transferred with reduced signature requirements
              </CardDescription>
            </div>
            <Button
              variant="primary"
              className="mt-4 sm:mt-0"
              startIcon={<PlusIcon className="w-4 h-4" />}
              onClick={() => setAddTokenModalOpen(true)}
            >
              Add Token
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search tokens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startIcon={<SearchIcon className="w-4 h-4 text-warm-textSecondary dark:text-gray-400" />}
              />
            </div>
            
            <Alert variant="info" className="mb-4">
              <AlertDescription>
                Whitelisted tokens can be transferred with only {selectedWallet.requiredSignatures - 1} signature(s) instead of the standard {selectedWallet.requiredSignatures} required for non-whitelisted tokens.
              </AlertDescription>
            </Alert>
            
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
                {filteredTokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-warm-textSecondary dark:text-gray-400">
                      No tokens found matching your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTokens.map((token) => (
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
                          onClick={() => toggleWhitelist(token.address)}
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
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 bg-warm-paper dark:bg-dark-200 rounded-lg border border-warm-divider dark:border-dark-100">
          <p className="text-warm-textSecondary dark:text-gray-400 mb-4">
            Please select a multi-signature wallet to manage its token whitelist.
          </p>
          {relatedMultisigWallets.length === 0 && (
            <Button
              variant="primary"
              onClick={() => router.push('/multisig')}
            >
              Create a Multi-signature Wallet
            </Button>
          )}
        </div>
      )}
      
      {/* Modal for adding a new token */}
      <Modal
        isOpen={addTokenModalOpen}
        onClose={closeAddTokenModal}
        title="Add Token to Whitelist"
        maxWidth="md"
      >
        <ModalBody>
          <div className="mb-4">
            <p className="text-warm-textSecondary dark:text-gray-400 mb-4">
              Enter a token contract address to add it to the whitelist.
            </p>
            
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                label="Token Contract Address"
                placeholder="0x..."
                value={newTokenAddress}
                onChange={(e) => setNewTokenAddress(e.target.value)}
                fullWidth
                disabled={isVerifying || !!verifiedToken}
              />
              <Button
                variant="default"
                onClick={verifyTokenAddress}
                disabled={!newTokenAddress || isVerifying || !!verifiedToken}
                isLoading={isVerifying}
                className="mt-2 md:mt-0 md:self-end"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
          
          {verifiedToken && (
            <div className="mt-6 p-4 bg-warm-bg dark:bg-dark-100 rounded-md">
              <h3 className="font-medium text-warm-text dark:text-white mb-2">
                Token Verified
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-warm-textSecondary dark:text-gray-400">Name:</span>
                  <p className="font-medium text-warm-text dark:text-white">{verifiedToken.name}</p>
                </div>
                <div>
                  <span className="text-warm-textSecondary dark:text-gray-400">Symbol:</span>
                  <p className="font-medium text-warm-text dark:text-white">{verifiedToken.symbol}</p>
                </div>
                <div>
                  <span className="text-warm-textSecondary dark:text-gray-400">Address:</span>
                  <p className="font-medium text-warm-text dark:text-white font-mono text-xs">{verifiedToken.address}</p>
                </div>
                <div>
                  <span className="text-warm-textSecondary dark:text-gray-400">Decimals:</span>
                  <p className="font-medium text-warm-text dark:text-white">{verifiedToken.decimals}</p>
                </div>
              </div>
            </div>
          )}
          
          <Alert variant="warning" className="mt-4">
            <AlertDescription>
              Adding a token to the whitelist will allow it to be transferred with reduced signature requirements. Make sure you trust this token contract.
            </AlertDescription>
          </Alert>
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="default"
            onClick={closeAddTokenModal}
            disabled={isAddingToWhitelist}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={addTokenToWhitelist}
            disabled={!verifiedToken || isAddingToWhitelist}
            isLoading={isAddingToWhitelist}
          >
            {isAddingToWhitelist ? "Adding..." : "Add to Whitelist"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default WhitelistPage;
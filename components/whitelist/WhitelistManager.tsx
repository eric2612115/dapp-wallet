'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletContext } from '@/contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { ChevronLeft as ChevronLeftIcon, Plus as PlusIcon, Search as SearchIcon, Shield as ShieldIcon } from 'lucide-react';
import BasicView from './BasicView';
import AdvancedView from './AdvancedView';
import AddTokenModal from './AddTokenModal';
import { Token, Protocol, VerifiedToken } from '@/types/whitelist';
import { mockTokens, mockProtocols } from '@/lib/mockData/whitelistData';

const WhitelistManager = () => {
  const { isConnected, mounted, relatedMultisigWallets, selectedMultisigWalletAddress, setSelectedMultisigWalletAddress, addAlert } = useWalletContext();
  const router = useRouter();
  
  // State for the whitelist functionality
  const [search, setSearch] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [addTokenModalOpen, setAddTokenModalOpen] = useState(false);
  const [view, setView] = useState<'basic' | 'advanced'>('basic');
  
  // Find the selected wallet
  const selectedWallet = relatedMultisigWallets.find(wallet => 
    wallet.multisig_address === selectedMultisigWalletAddress
  );
  
  // Load mock data
  useEffect(() => {
    setTokens(mockTokens);
    setProtocols(mockProtocols);
  }, []);
  
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
  
  // Filter protocols by search term
  const filteredProtocols = protocols.map(protocol => {
    // Check if protocol name matches
    const protocolMatches = protocol.name.toLowerCase().includes(search.toLowerCase()) ||
      protocol.description.toLowerCase().includes(search.toLowerCase());
    
    // Filter tokens
    const filteredTokens = protocol.tokens.filter(token => 
      token.name.toLowerCase().includes(search.toLowerCase()) || 
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.address.toLowerCase().includes(search.toLowerCase())
    );
    
    // Filter contracts and their functions
    const filteredContracts = protocol.contracts.map(contract => {
      // Check if contract matches
      const contractMatches = contract.name.toLowerCase().includes(search.toLowerCase()) ||
        contract.address.toLowerCase().includes(search.toLowerCase()) ||
        (contract.description && contract.description.toLowerCase().includes(search.toLowerCase()));
      
      // Filter functions
      const filteredFunctions = contract.functions.filter(func => 
        func.name.toLowerCase().includes(search.toLowerCase()) ||
        func.signature.toLowerCase().includes(search.toLowerCase()) ||
        (func.description && func.description.toLowerCase().includes(search.toLowerCase()))
      );
      
      return {
        ...contract,
        functions: filteredFunctions,
        expanded: contractMatches || filteredFunctions.length > 0 || contract.expanded
      };
    }).filter(contract => contract.functions.length > 0 || search === '');
    
    return {
      ...protocol,
      tokens: filteredTokens,
      contracts: filteredContracts,
      expanded: protocolMatches || filteredTokens.length > 0 || filteredContracts.length > 0 || protocol.expanded
    };
  }).filter(protocol => protocol.tokens.length > 0 || protocol.contracts.length > 0 || search === '');
  
  // Toggle whitelist status of a token in basic view
  const toggleTokenWhitelist = (address: string) => {
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
  
  // Toggle protocol token whitelist status
  const toggleProtocolTokenWhitelist = (protocolName: string, tokenAddress: string) => {
    setProtocols(protocols.map(protocol => {
      if (protocol.name === protocolName) {
        return {
          ...protocol,
          tokens: protocol.tokens.map(token => 
            token.address === tokenAddress 
              ? { ...token, whitelisted: !token.whitelisted } 
              : token
          )
        };
      }
      return protocol;
    }));
    
    // Find token for alert
    const protocol = protocols.find(p => p.name === protocolName);
    const token = protocol?.tokens.find(t => t.address === tokenAddress);
    
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
  
  // Toggle function whitelist status
  const toggleFunctionWhitelist = (protocolName: string, contractAddress: string, functionName: string) => {
    setProtocols(protocols.map(protocol => {
      if (protocol.name === protocolName) {
        return {
          ...protocol,
          contracts: protocol.contracts.map(contract => {
            if (contract.address === contractAddress) {
              return {
                ...contract,
                functions: contract.functions.map(func => 
                  func.name === functionName 
                    ? { ...func, whitelisted: !func.whitelisted } 
                    : func
                )
              };
            }
            return contract;
          })
        };
      }
      return protocol;
    }));
    
    // Find function for alert
    const protocol = protocols.find(p => p.name === protocolName);
    const contract = protocol?.contracts.find(c => c.address === contractAddress);
    const func = contract?.functions.find(f => f.name === functionName);
    
    if (func) {
      addAlert({
        type: 'success',
        title: func.whitelisted ? 'Function Removed' : 'Function Whitelisted',
        message: func.whitelisted 
          ? `${func.name} has been removed from the whitelist.` 
          : `${func.name} has been added to the whitelist.`
      });
    }
  };
  
  // Toggle protocol expansion in UI
  const toggleProtocolExpansion = (protocolName: string) => {
    setProtocols(protocols.map(protocol => 
      protocol.name === protocolName 
        ? { ...protocol, expanded: !protocol.expanded } 
        : protocol
    ));
  };
  
  // Toggle contract expansion in UI
  const toggleContractExpansion = (protocolName: string, contractAddress: string) => {
    setProtocols(protocols.map(protocol => {
      if (protocol.name === protocolName) {
        return {
          ...protocol,
          contracts: protocol.contracts.map(contract => 
            contract.address === contractAddress 
              ? { ...contract, expanded: !contract.expanded } 
              : contract
          )
        };
      }
      return protocol;
    }));
  };
  
  // Add token to whitelist
  const addTokenToWhitelist = (verifiedToken: VerifiedToken) => {
    // Add to basic view tokens
    setTokens([
      ...tokens,
      { 
        symbol: verifiedToken.symbol, 
        name: verifiedToken.name, 
        address: verifiedToken.address, 
        whitelisted: true,
        type: 'token'
      }
    ]);
    
    addAlert({
      type: 'success',
      title: 'Token Added',
      message: `${verifiedToken.symbol} has been added to the whitelist.`
    });
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
            Manage whitelisted tokens and contracts for simplified approvals
          </p>
        </div>
      </div>
      
      {/* Select wallet */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Wallet</CardTitle>
          <CardDescription>
            Choose a multi-signature wallet to manage its whitelist
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
              <CardTitle>Whitelisted Items</CardTitle>
              <CardDescription>
                Items on this list can be used with reduced signature requirements
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <div className="flex border border-warm-divider dark:border-dark-100 rounded-md overflow-hidden">
                <button
                  className={`px-3 py-1.5 text-sm ${
                    view === 'basic' 
                      ? 'bg-warm-primary text-white' 
                      : 'bg-warm-paper dark:bg-dark-200 text-warm-text dark:text-white'
                  }`}
                  onClick={() => setView('basic')}
                >
                  Basic
                </button>
                <button
                  className={`px-3 py-1.5 text-sm ${
                    view === 'advanced' 
                      ? 'bg-warm-primary text-white' 
                      : 'bg-warm-paper dark:bg-dark-200 text-warm-text dark:text-white'
                  }`}
                  onClick={() => setView('advanced')}
                >
                  Advanced
                </button>
              </div>
              <Button
                variant="primary"
                startIcon={<PlusIcon className="w-4 h-4" />}
                onClick={() => setAddTokenModalOpen(true)}
              >
                Add Token
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startIcon={<SearchIcon className="w-4 h-4 text-warm-textSecondary dark:text-gray-400" />}
              />
            </div>
            
            <Alert variant="info" className="mb-4">
              <AlertDescription>
                Whitelisted items can be used with only {selectedWallet.requiredSignatures - 1} signature(s) instead of the standard {selectedWallet.requiredSignatures} required for non-whitelisted items.
              </AlertDescription>
            </Alert>
            
            {view === 'basic' ? (
              <BasicView 
                tokens={filteredTokens} 
                onToggleWhitelist={toggleTokenWhitelist} 
              />
            ) : (
              <AdvancedView 
                protocols={filteredProtocols}
                onToggleProtocolExpansion={toggleProtocolExpansion}
                onToggleContractExpansion={toggleContractExpansion}
                onToggleTokenWhitelist={toggleProtocolTokenWhitelist}
                onToggleFunctionWhitelist={toggleFunctionWhitelist}
              />
            )}
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
      
      {/* Add Token Modal */}
      <AddTokenModal
        open={addTokenModalOpen}
        onClose={() => setAddTokenModalOpen(false)}
        onAddToken={addTokenToWhitelist}
      />
    </div>
  );
};

export default WhitelistManager;
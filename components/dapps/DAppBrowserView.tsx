'use client';

import React, { useState, useEffect } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import {
  Globe as GlobeIcon,
  BookmarkIcon,
  Search as SearchIcon,
  ArrowRight as ArrowRightIcon,
  ExternalLink as ExternalLinkIcon,
  Star as StarIcon,
  Flame as FlameIcon,
  PlusCircle as PlusCircleIcon
} from 'lucide-react';
import DAppCard from './DAppCard';
import { mockDAppsList } from '@/lib/mockData/dappsData';
import ConnectDAppModal from './ConnectDAppModal';

const DAppBrowserView = () => {
  const { isConnected, mounted, relatedMultisigWallets, selectedMultisigWalletAddress, setSelectedMultisigWalletAddress } = useWalletContext();
  const [searchQuery, setSearchQuery] = useState('');
  interface DApp {
    id: string;
    name: string;
    url: string;
    description: string;
    categories: string[];
    logo?: string;
    bookmarked?: boolean;
  }

  const [dapps, setDapps] = useState<DApp[]>([]); // Use the actual DApp type
  const [category, setCategory] = useState('all');
  const [url, setUrl] = useState('');
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedDApp, setSelectedDApp] = useState<DApp | null>(null);
  
  // Find the selected wallet
  const selectedWallet = relatedMultisigWallets.find(wallet => 
    wallet.multisig_address === selectedMultisigWalletAddress
  );
  
  // Load mock DApps data
  useEffect(() => {
    setDapps(mockDAppsList);
  }, []);
  
  // Create wallet options for dropdown
  const walletOptions = [
    { value: 'personal', label: 'Personal Wallet' },
    ...relatedMultisigWallets.map(wallet => ({
      value: wallet.multisig_address,
      label: `${wallet.name} (${wallet.requiredSignatures}/${wallet.totalSigners})`
    }))
  ];
  
  // Handle wallet selection
  const handleWalletChange = (value: string) => {
    if (value === 'personal') {
      // Handle personal wallet selection
    } else {
      setSelectedMultisigWalletAddress(value);
    }
  };
  
  // Handle DApp connection
  const handleConnectDApp = (dapp?: DApp) => {
    if (dapp) {
      setSelectedDApp(dapp);
      setUrl(dapp.url);
    }
    setConnectModalOpen(true);
  };
  
  // Handle URL input submit
  const handleUrlSubmit = () => {
    if (!url) return;
    setSelectedDApp(null);
    setConnectModalOpen(true);
  };
  
  // Filter DApps by search and category
  const filteredDApps = dapps.filter(dapp => {
    const matchesSearch = dapp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dapp.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = category === 'all' || dapp.categories.includes(category);
    
    return matchesSearch && matchesCategory;
  });
  
  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All DApps' },
    { value: 'defi', label: 'DeFi' },
    { value: 'exchange', label: 'Exchanges' },
    { value: 'lending', label: 'Lending' },
    { value: 'nft', label: 'NFT' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'social', label: 'Social' }
  ];

  // Show nothing when not mounted (to prevent hydration issues)
  if (!mounted) {
    return null;
  }
  
  if (!isConnected) {
    return (
      <div className="text-center py-8 flex flex-col items-center justify-center bg-warm-paper dark:bg-dark-200 rounded-lg border border-warm-divider dark:border-dark-100">
        <div className="bg-warm-bg dark:bg-warm-primary/30 text-warm-primary dark:text-warm-secondary w-16 h-16 flex items-center justify-center rounded-full mb-2">
          <GlobeIcon size={32} />
        </div>
        <h2 className="text-xl font-semibold text-warm-text dark:text-white mb-2">
          Please connect your wallet to use the DApp Browser
        </h2>
        <p className="text-warm-textSecondary dark:text-gray-400 max-w-md mb-6">
          Connect your wallet to browse and interact with decentralized applications using your personal or multi-signature wallet.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warm-text dark:text-white mb-1">
          DApp Browser
        </h1>
        <p className="text-warm-textSecondary dark:text-gray-300">
          Browse and interact with decentralized applications using your multi-signature wallet
        </p>
      </div>
      
      {/* Connect Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connect to DApp</CardTitle>
          <CardDescription>
            Enter a DApp URL or select from recommended DApps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Input
                  placeholder="Enter DApp URL (e.g., https://app.uniswap.org)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  startIcon={<GlobeIcon className="h-4 w-4 text-warm-textSecondary dark:text-gray-400" />}
                />
              </div>
              <div>
                <Button
                  variant="primary"
                  onClick={handleUrlSubmit}
                  disabled={!url}
                  fullWidth
                  className="h-full"
                  startIcon={<ArrowRightIcon className="h-4 w-4" />}
                >
                  Connect
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-warm-text dark:text-gray-300 mb-1">
                Active Wallet
              </label>
              <Select
                options={walletOptions}
                value={selectedMultisigWalletAddress || 'personal'}
                onChange={handleWalletChange}
                fullWidth
              />
              {selectedWallet && (
                <p className="mt-1 text-xs text-warm-textSecondary dark:text-gray-400">
                  Requires {selectedWallet.requiredSignatures} out of {selectedWallet.totalSigners} signatures for transactions
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Featured DApps */}
      <Card className="mb-6">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <CardTitle>Featured DApps</CardTitle>
            <CardDescription>
              Popular decentralized applications
            </CardDescription>
          </div>
          <div className="flex mt-4 sm:mt-0">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat.value}
                  variant={category === cat.value ? 'primary' : 'default'}
                  className="cursor-pointer"
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search DApps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<SearchIcon className="h-4 w-4 text-warm-textSecondary dark:text-gray-400" />}
            />
          </div>
          
          {filteredDApps.length === 0 ? (
            <div className="text-center py-8 text-warm-textSecondary dark:text-gray-400">
              No DApps found matching your search
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDApps.map((dapp) => (
                <DAppCard
                  key={dapp.id}
                  dapp={dapp}
                  onConnect={() => handleConnectDApp(dapp)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent & Bookmarked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FlameIcon className="h-5 w-5 mr-2 text-warm-primary" />
                Recent DApps
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {dapps.slice(0, 3).map((dapp) => (
              <div 
                key={dapp.id} 
                className="flex items-center justify-between p-3 mb-2 hover:bg-warm-bg dark:hover:bg-dark-100 rounded-md cursor-pointer"
                onClick={() => handleConnectDApp(dapp)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-md bg-warm-bg dark:bg-dark-100 flex items-center justify-center mr-3 overflow-hidden">
                    {dapp.logo ? (
                      <img src={dapp.logo} alt={dapp.name} className="w-full h-full object-cover" />
                    ) : (
                      <GlobeIcon className="h-6 w-6 text-warm-textSecondary dark:text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-warm-text dark:text-white">{dapp.name}</div>
                    <div className="text-xs text-warm-textSecondary dark:text-gray-400">{dapp.url}</div>
                  </div>
                </div>
                <ExternalLinkIcon className="h-4 w-4 text-warm-textSecondary dark:text-gray-400" />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BookmarkIcon className="h-5 w-5 mr-2 text-warm-primary" />
                Bookmarked DApps
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
            >
              Add New
            </Button>
          </CardHeader>
          <CardContent>
            {dapps.filter(d => d.bookmarked).length === 0 ? (
              <div className="text-center py-6 text-warm-textSecondary dark:text-gray-400">
                <p className="mb-4">No bookmarked DApps yet</p>
                <Button
                  variant="outline"
                  startIcon={<PlusCircleIcon className="h-4 w-4" />}
                >
                  Add Your First Bookmark
                </Button>
              </div>
            ) : (
              dapps.filter(d => d.bookmarked).map((dapp) => (
                <div 
                  key={dapp.id} 
                  className="flex items-center justify-between p-3 mb-2 hover:bg-warm-bg dark:hover:bg-dark-100 rounded-md cursor-pointer"
                  onClick={() => handleConnectDApp(dapp)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md bg-warm-bg dark:bg-dark-100 flex items-center justify-center mr-3 overflow-hidden">
                      {dapp.logo ? (
                        <img src={dapp.logo} alt={dapp.name} className="w-full h-full object-cover" />
                      ) : (
                        <GlobeIcon className="h-6 w-6 text-warm-textSecondary dark:text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-warm-text dark:text-white">{dapp.name}</div>
                      <div className="text-xs text-warm-textSecondary dark:text-gray-400">{dapp.url}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
                    <ExternalLinkIcon className="h-4 w-4 text-warm-textSecondary dark:text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Connect DApp Modal */}
      <ConnectDAppModal
        open={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        url={url}
        dapp={selectedDApp || undefined}
        wallet={selectedWallet || { name: 'Personal Wallet', requiredSignatures: 1, totalSigners: 1 }}
      />
    </div>
  );
};

export default DAppBrowserView;
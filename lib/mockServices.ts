// lib/mockServices.ts

// Mock AssetService implementation
export const AssetService = {
    assetControllerGetAssetsList: async ({ chainId }: { chainId: string }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return {
        chainId: parseInt(chainId),
        data: [
          {
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            token: {
              symbol: 'ETH',
              name: 'Ethereum',
              decimals: 18
            }
          },
          {
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            token: {
              symbol: 'USDC',
              name: 'USD Coin',
              decimals: 6
            }
          },
          {
            address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            token: {
              symbol: 'LINK',
              name: 'Chainlink',
              decimals: 18
            }
          }
        ]
      };
    },
    
    assetControllerGetAssetsAndPriceList: async ({ chainId }: { chainId: string }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return {
        chainId: parseInt(chainId),
        assets: [
          {
            symbol: 'ETH',
            name: 'Ethereum',
            decimals: 18,
            price: 3500,
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            assetId: 'eth',
            assetType: 'native',
            protocolId: 'ethereum',
            isRebasing: false
          },
          {
            symbol: 'USDC',
            name: 'USD Coin',
            decimals: 6,
            price: 1,
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            assetId: 'usdc',
            assetType: 'erc20',
            protocolId: 'circle',
            isRebasing: false
          },
          {
            symbol: 'LINK',
            name: 'Chainlink',
            decimals: 18,
            price: 15,
            address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            assetId: 'link',
            assetType: 'erc20',
            protocolId: 'chainlink',
            isRebasing: false
          }
        ]
      };
    }
  };
  
  // Mock WalletService implementation
  export const WalletService = {
    walletControllerBalance: async ({ owner }: { owner: string }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock data
      return {
        owner,
        list: [
          {
            symbol: 'ETH',
            tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            balance: '2.5',
            formattedBalance: '2.5',
            price: 3500,
            usdValue: 8750
          },
          {
            symbol: 'USDC',
            tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            balance: '5000',
            formattedBalance: '5,000',
            price: 1,
            usdValue: 5000
          },
          {
            symbol: 'LINK',
            tokenAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            balance: '100',
            formattedBalance: '100',
            price: 15,
            usdValue: 1500
          }
        ]
      };
    },
    
    walletControllerListWallets: async ({ 
      ownerAddress, 
      chain 
    }: { 
      ownerAddress: string, 
      chain?: string | number 
    }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return {
        chain: typeof chain === 'string' ? chain : chain?.toString() || 'ethereum',
        safeWalletList: [
          {
            id: '1',
            chain: 'Ethereum',
            chainId: 1,
            txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            safeAddress: '0x1234567890123456789012345678901234567890',
            guardAddress: '0x0987654321098765432109876543210987654321',
            ownerAddress,
            aiAddress: '0xabcdef0123456789abcdef0123456789abcdef01',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            chain: 'Polygon',
            chainId: 137,
            txHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
            safeAddress: '0x0987654321098765432109876543210987654321',
            guardAddress: '0x1234567890123456789012345678901234567890',
            ownerAddress,
            aiAddress: '0x23456789abcdef0123456789abcdef0123456789',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      };
    },
    
    walletControllerCreateWallet: async ({ 
      chain
    }: { 
      chain: string, 
      ownerAddress: string 
    }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return mock data
      return {
        chain,
        safeWalletAddress: '0x' + Math.random().toString(16).substring(2, 42),
        guardAddress: '0x' + Math.random().toString(16).substring(2, 42),
        txHash: '0x' + Math.random().toString(16).substring(2, 66)
      };
    },
    
    walletControllerSwapHistory: async ({ 
      safeWalletAddress, 
      chain 
    }: { 
      safeWalletAddress: string, 
      chain?: string 
    }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock data
      return {
        chain: chain || 'ethereum',
        safeWalletAddress,
        transactions: [
          {
            hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            type: 'Swap',
            from: safeWalletAddress,
            to: '0xdead...beef',
            amount: '0.5 ETH',
            value: '1,750 USD',
            timestamp: new Date().toISOString(),
            status: 'completed',
            chain: chain || 'Ethereum',
            details: 'Swap ETH for USDC',
            chainIndex: chain === 'polygon' ? '137' : '1'
          },
          {
            hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
            type: 'Send',
            from: safeWalletAddress,
            to: '0xcafe...babe',
            amount: '1000 USDC',
            value: '1,000 USD',
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            status: 'completed',
            chain: chain || 'Ethereum',
            details: 'Payment to vendor',
            chainIndex: chain === 'polygon' ? '137' : '1'
          },
          {
            hash: '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
            type: 'Receive',
            from: '0xface...book',
            to: safeWalletAddress,
            amount: '0.25 ETH',
            value: '875 USD',
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            status: 'completed',
            chain: chain || 'Ethereum',
            details: 'Deposit from exchange',
            chainIndex: chain === 'polygon' ? '137' : '1'
          }
        ]
      };
    }
  };
  
  // Export a combined object for all services
  export const lib = {
    wallet: {
      WalletService,
      AssetService
    }
  };
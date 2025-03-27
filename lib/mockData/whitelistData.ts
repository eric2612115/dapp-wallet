// lib/mockData/whitelistData.ts
import { Token, Protocol } from '@/types/whitelist';

// Basic token list
export const mockTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', whitelisted: true, type: 'token' },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', whitelisted: true, type: 'token' },
  { symbol: 'LINK', name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', whitelisted: false, type: 'token' },
  { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', whitelisted: false, type: 'token' },
  { symbol: 'AAVE', name: 'Aave', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', whitelisted: false, type: 'token' },
];

// Advanced protocol list
export const mockProtocols: Protocol[] = [
  {
    name: 'Aave',
    description: 'Decentralized lending and borrowing protocol',
    tokens: [
      { symbol: 'AAVE', name: 'Aave Token', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', whitelisted: false, type: 'token', parent: 'Aave' }
    ],
    contracts: [
      {
        name: 'Aave Lending Pool',
        address: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
        description: 'Main Aave lending pool contract',
        functions: [
          { name: 'deposit', signature: 'deposit(address,uint256,address,uint16)', description: 'Deposit tokens to the lending pool', whitelisted: true },
          { name: 'withdraw', signature: 'withdraw(address,uint256,address)', description: 'Withdraw tokens from the lending pool', whitelisted: true },
          { name: 'borrow', signature: 'borrow(address,uint256,uint256,uint16,address)', description: 'Borrow tokens from the lending pool', whitelisted: false },
          { name: 'repay', signature: 'repay(address,uint256,uint256,address)', description: 'Repay a loan', whitelisted: false }
        ]
      }
    ],
    expanded: false
  },
  {
    name: 'Uniswap',
    description: 'Decentralized exchange protocol',
    tokens: [
      { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', whitelisted: false, type: 'token', parent: 'Uniswap' }
    ],
    contracts: [
      {
        name: 'Uniswap V3 Router',
        address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        description: 'Main Uniswap V3 router contract',
        functions: [
          { name: 'exactInputSingle', signature: 'exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))', description: 'Swap tokens with exact input', whitelisted: true },
          { name: 'exactInput', signature: 'exactInput((bytes,address,uint256,uint256))', description: 'Swap tokens with exact input along a specified path', whitelisted: true },
          { name: 'exactOutputSingle', signature: 'exactOutputSingle((address,address,uint24,address,uint256,uint256,uint160))', description: 'Swap tokens with exact output', whitelisted: false },
          { name: 'exactOutput', signature: 'exactOutput((bytes,address,uint256,uint256))', description: 'Swap tokens with exact output along a specified path', whitelisted: false }
        ]
      }
    ],
    expanded: false
  },
  {
    name: 'Compound',
    description: 'Decentralized lending protocol',
    tokens: [
      { symbol: 'COMP', name: 'Compound', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', whitelisted: false, type: 'token', parent: 'Compound' }
    ],
    contracts: [
      {
        name: 'Compound cERC20',
        address: '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5',
        description: 'Compound ERC20 money market contract',
        functions: [
          { name: 'mint', signature: 'mint(uint256)', description: 'Supply tokens to the money market', whitelisted: true },
          { name: 'redeem', signature: 'redeem(uint256)', description: 'Withdraw tokens from the money market', whitelisted: true },
          { name: 'borrow', signature: 'borrow(uint256)', description: 'Borrow tokens from the money market', whitelisted: false },
          { name: 'repayBorrow', signature: 'repayBorrow(uint256)', description: 'Repay a loan', whitelisted: false }
        ]
      }
    ],
    expanded: false
  }
];
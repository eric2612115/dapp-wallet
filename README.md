# DApp Wallet - Portfolio Page

This repository contains a restructured implementation of the Portfolio page for a DApp Wallet application built with Next.js, React, and Material UI.

## Project Structure

The project has been restructured to improve maintainability by separating concerns:

```
/app
  /portfolio
    page.tsx               # Main portfolio page component
/components
  /portfolio
    AssetControls.tsx      # Search and action buttons component
    AssetTable.tsx         # Table for displaying assets
    DepositDialog.tsx      # Dialog for deposit functionality
    MultisigWalletSelector.tsx # Component for selecting multi-sig wallets
    QuickTransferCard.tsx  # Card component for transfers between wallets
    TransactionHistory.tsx # Component for displaying transaction history
    WalletOverview.tsx     # Overview card for wallet information
    WalletTabs.tsx         # Tabs for switching between wallet types
    WithdrawHandler.tsx    # Component handling withdraw functionality
/hooks
  useAssets.ts             # Hook for fetching and managing assets
  useTransactions.ts       # Hook for fetching and managing transactions
  useWalletData.ts         # Hook for wallet-related data and operations
  useWithdraw.ts           # Hook for handling withdraw operations
/lib
  /hooks
    usePageView.ts         # Analytics hook
    useQueryWallets.ts     # Hook for querying wallets from API
    useWithdrawFromSafe.ts # Hook for safe withdrawals
  /mockServices.ts         # Mock service implementations for API calls
/types
  assets.ts                # Type definitions for assets and related data
  transactions.ts          # Type definitions for transaction data
```

## Key Features

- **Wallet Management**: Support for personal and multi-signature wallets
- **Asset Tracking**: Display and management of digital assets across different blockchains
- **Transfer Functionality**: Transfer assets between wallets
- **Dark Mode Support**: Full dark mode theming with Material UI
- **Responsive Design**: Adapts to different screen sizes

## Design Decisions

1. **Hooks-based Architecture**: Custom hooks are used to separate data fetching and state management logic from UI components.
2. **Type Definitions**: Strong TypeScript typing for all data structures.
3. **Component Composition**: Breaking UI into smaller, reusable components.
4. **API Abstraction**: API calls are abstracted through service layers for better testability.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000/portfolio](http://localhost:3000/portfolio) in your browser to see the portfolio page.

## Implementation Notes

- The application uses Material UI for UI components
- Tailwind CSS for styling with custom theme configuration
- React hooks for state management
- wagmi for Web3 connectivity
- Next.js for routing and server-side functionality
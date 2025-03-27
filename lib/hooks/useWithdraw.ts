// hooks/useWithdraw.ts
import { useState, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useWithdrawFromSafe } from '@/lib/hooks/useWithdrawFromSafe';
import { AssetService } from '@/lib/mockServices';
import type { Asset } from '@/types/assets';

export function useWithdraw() {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const withdrawFromSafe = useWithdrawFromSafe();
  const { address } = useAccount();
  const chainId = useChainId();
  
  const handleWithdraw = useCallback(async (
    asset: Asset, 
    multisigWalletAddress: string,
    walletName: string,
    onSuccess?: (message: string) => void,
    onError?: (message: string) => void
  ) => {
    const tokenAddress = asset.tokenAddress || null;
    if (!tokenAddress) {
      if (onError) onError('Token address not found');
      return;
    }
    
    setWithdrawing(true);
    setWithdrawError(null);
    
    try {
      // Get token information
      const assetInfo = await AssetService.assetControllerGetAssetsList({
        chainId: chainId?.toString() || '1'
      });
      
      const targetAsset = assetInfo.data.find(
        (a: { address: string }) => a.address.toLowerCase() === tokenAddress.toLowerCase()
      );
      
      if (!targetAsset) {
        throw new Error('Token info not found');
      }
      
      const decimals = targetAsset.token.decimals;

      // Execute withdrawal
      await withdrawFromSafe(
        multisigWalletAddress,
        tokenAddress,
        asset.balance.toString(),
        address || '',
        decimals,
      );
      
      const successMessage = `Withdrawal request submitted for ${asset.balance} ${asset.symbol} from ${walletName}`;
      if (onSuccess) onSuccess(successMessage);
    } catch (error) {
      console.error('Error withdrawing from safe:', error);
      const errorMessage = `Error: ${error instanceof Error ? error.message : 'Failed to withdraw asset'}`;
      setWithdrawError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setWithdrawing(false);
    }
  }, [address, chainId, withdrawFromSafe]);
  
  return {
    withdrawing,
    withdrawError,
    handleWithdraw
  };
}
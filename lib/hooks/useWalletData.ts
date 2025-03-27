// hooks/useWalletData.ts
import { useState, useEffect } from 'react';
import { useChainId } from 'wagmi';
import { useQueryWallets } from '@/lib/hooks/useQueryWallets';
import type { MultisigWallet } from '@/types/assets';

export function useWalletData(
  address: string | undefined,
  mounted: boolean,
  isConnected: boolean
) {
  const [totalBalance, setTotalBalance] = useState(0);
  const [relatedMultisigWallets, setRelatedMultisigWallets] = useState<MultisigWallet[]>([]);
  const [selectedMultisigWalletAddress, setSelectedMultisigWalletAddress] = useState<string>('');
  const [loadingRelatedWallets, setLoadingRelatedWallets] = useState(false);
  const chainId = useChainId();
  
  // 使用 useQueryWallets hook 來獲取與用戶關聯的多簽錢包
  const { 
    data: walletsData,
    isLoading: isLoadingWallets,
    error: walletsError,
    refetch: refetchWallets
  } = useQueryWallets({
    chain: chainId,
    ownerAddress: address || '',
    enabled: mounted && isConnected && Boolean(address)
  });
  
  // 當錢包數據可用時處理它
  useEffect(() => {
    if (walletsData?.safeWalletList && walletsData.safeWalletList.length > 0) {
      interface WalletData {
        safeAddress: string;
        chain?: string;
        chainId?: number;
      }

      // 將 API 返回的數據格式化為應用程序使用的格式
      const formattedWallets: MultisigWallet[] = walletsData.safeWalletList.map((wallet: WalletData, idx: number) => ({
        name: `Multi-Sig Wallet-${idx + 1}`,
        multisig_address: wallet.safeAddress,
        chain: wallet.chain || 'Ethereum',
        chainId: wallet.chainId ?? (wallet.chain ? parseInt(wallet.chain) : chainId || 1),
      }));
      
      setRelatedMultisigWallets(formattedWallets);
      
      // 如果沒有選擇多簽錢包，則默認選擇第一個
      if (formattedWallets.length > 0 && !selectedMultisigWalletAddress) {
        setSelectedMultisigWalletAddress(formattedWallets[0].multisig_address);
      }
    } else {
      setRelatedMultisigWallets([]);
    }
  }, [walletsData, selectedMultisigWalletAddress, chainId]);
  
  // 更新總餘額
  const updateTotalBalance = (balance: number) => {
    setTotalBalance(balance);
  };
  
  // 處理創建新的多簽錢包
  const handleCreateMultisig = async () => {
    try {
      // 顯示加載狀態
      setLoadingRelatedWallets(true);
      
      // 刷新錢包列表
      await refetchWallets();
    } catch (error) {
      console.error('Error refreshing wallet list:', error);
    } finally {
      setLoadingRelatedWallets(false);
    }
  };
  
  // 返回所有需要的狀態和函數
  return {
    totalBalance,
    updateTotalBalance,
    relatedMultisigWallets,
    selectedMultisigWalletAddress,
    loadingRelatedWallets,
    isLoadingWallets,
    walletsError,
    setSelectedMultisigWalletAddress,
    handleCreateMultisig,
    refetchWallets
  };
}
// hooks/useWithdrawFromSafe.ts
import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';

// ERC20 ABI (minimal for transfer)
const erc20Abi = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  }
];

export function useWithdrawFromSafe() {
  const { writeContractAsync } = useWriteContract();
  
  const withdrawFromSafe = useCallback(async (
    safeAddress: string,
    tokenAddress: string,
    amount: string,
    toAddress: string,
    decimals: number = 18
  ) => {
    if (!safeAddress || !tokenAddress || !amount || !toAddress) {
      throw new Error('Missing required parameters for withdrawal');
    }
    
    try {
      // Parse the amount with correct decimals
      const parsedAmount = parseUnits(amount, decimals);
      
      // Execute the transfer from safe to recipient
      const hash = await writeContractAsync({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [toAddress as `0x${string}`, parsedAmount]
      });
      
      return hash;
    } catch (error) {
      console.error('Error withdrawing from safe:', error);
      throw error;
    }
  }, [writeContractAsync]);
  
  return withdrawFromSafe;
}
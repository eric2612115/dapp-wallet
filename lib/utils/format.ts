/**
 * Format an address to a shortened form (e.g., 0x1234...5678)
 */
export function formatAddress(address: string, startLength = 6, endLength = 4): string {
    if (!address || typeof address !== 'string') {
      return '';
    }
    if (address.length <= startLength + endLength) {
      return address;
    }
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  }
  
  /**
   * Format currency with K, M, B abbreviations
   */
  export function formatCurrency(amount: number, decimals = 2, currency = '$'): string {
    if (amount >= 1000000000) {
      return `${currency}${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `${currency}${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${currency}${(amount / 1000).toFixed(1)}K`;
    } else {
      return `${currency}${amount.toFixed(decimals)}`;
    }
  }
  
  /**
   * Format percentage for display
   */
  export function formatPercentage(amount: number, decimals = 2): string {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(decimals)}%`;
  }
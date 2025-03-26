// components/shared/ConnectWalletButton.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        openChainModal,
        openAccountModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="rounded-md bg-[#C06653] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#A84236] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C06653]"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="rounded-md bg-[#E66C64] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#d45a52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E66C64]"
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center rounded-md bg-[#F0F0F0] dark:bg-[#3D3D3D] px-3 py-2 text-sm font-medium text-[#333333] dark:text-[#E0E0E0] hover:bg-[#E0E0E0] dark:hover:bg-[#4D4D4D]"
                  >
                    {chain.hasIcon && (
                      <div
                        className="mr-1 h-4 w-4 rounded-full"
                        style={{
                          background: chain.iconBackground,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="h-4 w-4"
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center rounded-md bg-[#F0F0F0] dark:bg-[#3D3D3D] px-3 py-2 text-sm font-medium text-[#333333] dark:text-[#E0E0E0] hover:bg-[#E0E0E0] dark:hover:bg-[#4D4D4D]"
                  >
                    <span>{account.displayName}</span>
                    <span className="text-[#666666] dark:text-[#AAAAAA] ml-1">
                      {account.displayBalance ? `(${account.displayBalance})` : ''}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
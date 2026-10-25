import React from 'react'
import { useWallet, UPLOADER_ACCOUNT, BUYER_ACCOUNT } from '../hooks/useWallet'
import { CheckCircle, Wallet, ShieldCheck, ShoppingCart } from 'lucide-react'

interface AccountSwitcherProps {
  className?: string
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ className = '' }) => {
  const { 
    account, 
    setRole,
    isUploader,
    isBuyer,
    isConnected,
    balance
  } = useWallet()

  if (!isConnected || !account) {
    return null
  }

  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className={`account-switcher space-y-4 text-white ${className}`}>
      {/* Current Active Role Badge */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
          Active Transaction Role
        </label>
        <div className={`rounded-lg p-3 border ${
          isUploader 
            ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' 
            : 'bg-blue-950/40 border-blue-500/50 text-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-sm">
              {isUploader ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Uploader / Seller Role
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                  Buyer Role
                </>
              )}
            </span>
            <span className="flex items-center gap-1 text-[11px] bg-white/10 px-2 py-0.5 rounded-full font-mono">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> Active
            </span>
          </div>

          <div className="mt-2 text-xs font-mono text-gray-300 break-all">
            {account}
          </div>

          {balance && (
            <div className="mt-1 text-xs text-gray-400">
              Balance: <span className="font-semibold text-white">{parseFloat(balance).toFixed(4)} tBNB</span>
            </div>
          )}

          <div className="mt-2 text-[11px] text-gray-400 border-t border-white/10 pt-1.5">
            {isUploader 
              ? 'Publishes datasets and receives tBNB payments directly from buyer transactions.'
              : 'Executes purchase transactions on BSC Testnet and unlocks dataset downloads.'}
          </div>
        </div>
      </div>

      {/* 2 Transaction Roles Switcher */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Switch Transaction Role
        </label>
        
        <div className="grid grid-cols-1 gap-2">
          {/* Uploader / Seller Role Button */}
          <button
            type="button"
            onClick={() => setRole('uploader')}
            disabled={isUploader}
            className={`w-full text-left p-2.5 rounded-lg border transition-all ${
              isUploader
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 cursor-default ring-1 ring-amber-500/30'
                : 'bg-gray-800/60 border-white/10 hover:bg-gray-700/60 hover:border-amber-500/40 text-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Uploader / Seller
              </span>
              {isUploader && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                  Current
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-gray-400 mt-1">
              {formatAddress(UPLOADER_ACCOUNT)}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              Receives purchase payments (0.001 tBNB)
            </div>
          </button>

          {/* Buyer Role Button */}
          <button
            type="button"
            onClick={() => setRole('buyer')}
            disabled={isBuyer}
            className={`w-full text-left p-2.5 rounded-lg border transition-all ${
              isBuyer
                ? 'bg-blue-500/15 border-blue-500/50 text-blue-300 cursor-default ring-1 ring-blue-500/30'
                : 'bg-gray-800/60 border-white/10 hover:bg-gray-700/60 hover:border-blue-500/40 text-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
                Buyer / Purchaser
              </span>
              {isBuyer && (
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                  Current
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-gray-400 mt-1">
              {formatAddress(BUYER_ACCOUNT)}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              Sends payments to buy & download datasets
            </div>
          </button>
        </div>
      </div>

      {/* Helper notice */}
      <div className="text-[11px] text-gray-400 bg-gray-800/30 p-2 rounded border border-white/5 flex items-start gap-1.5">
        <Wallet className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <span>Switching role updates your active transaction signer, permissions, and dataset state.</span>
      </div>
    </div>
  )
}

export default AccountSwitcher

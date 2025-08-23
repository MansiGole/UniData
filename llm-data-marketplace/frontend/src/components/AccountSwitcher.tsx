import React from 'react'
import { useWallet } from '../hooks/useWallet'

interface AccountSwitcherProps {
  className?: string
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ className = '' }) => {
  const { 
    account, 
    accounts, 
    switchAccount, 
    uploaderAccount, 
    buyerAccount,
    isConnected 
  } = useWallet()

  if (!isConnected || accounts.length === 0) {
    return null
  }

  const getAccountRole = (address: string) => {
    if (address.toLowerCase() === uploaderAccount.toLowerCase()) {
      return 'Uploader'
    }
    if (address.toLowerCase() === buyerAccount.toLowerCase()) {
      return 'Buyer'
    }
    return 'General'
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className={`account-switcher ${className}`}>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Active Account
        </label>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm font-mono text-blue-800">
            {formatAddress(account || '')}
          </div>
          <div className="text-xs text-blue-600">
            Role: {getAccountRole(account || '')}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Switch
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => switchAccount(uploaderAccount)}
            disabled={account?.toLowerCase() === uploaderAccount.toLowerCase()}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              account?.toLowerCase() === uploaderAccount.toLowerCase()
                ? 'bg-green-50 border-green-200 cursor-not-allowed'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium text-sm">Uploader Account</div>
            <div className="text-xs text-gray-500 font-mono">
              {formatAddress(uploaderAccount)}
            </div>
            <div className="text-xs text-gray-400">For dataset & model uploads</div>
          </button>
          
          <button
            onClick={() => switchAccount(buyerAccount)}
            disabled={account?.toLowerCase() === buyerAccount.toLowerCase()}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              account?.toLowerCase() === buyerAccount.toLowerCase()
                ? 'bg-green-50 border-green-200 cursor-not-allowed'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium text-sm">Buyer Account</div>
            <div className="text-xs text-gray-500 font-mono">
              {formatAddress(buyerAccount)}
            </div>
            <div className="text-xs text-gray-400">For purchasing items</div>
          </button>
        </div>
      </div>

      {accounts.length > 2 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            All Available Accounts
          </label>
          <div className="max-h-32 overflow-y-auto">
            {accounts.map((addr: string) => (
              <button
                key={addr}
                onClick={() => switchAccount(addr)}
                disabled={account?.toLowerCase() === addr.toLowerCase()}
                className={`w-full text-left p-2 rounded border mb-1 transition-colors ${
                  account?.toLowerCase() === addr.toLowerCase()
                    ? 'bg-gray-50 border-gray-300 cursor-not-allowed'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-mono">{formatAddress(addr)}</div>
                <div className="text-xs text-gray-400">
                  {getAccountRole(addr)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountSwitcher

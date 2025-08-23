import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { useWallet } from '../../hooks/useWallet'
import { Wallet, Database, Home, ShoppingCart, Upload, Brain, ChevronDown } from 'lucide-react'
import FloatingActionButton from '../FloatingActionButton'
import AccountSwitcher from '../AccountSwitcher'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const { account, isConnected, isConnecting, connect, disconnect } = useWallet()
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAccountSwitcher(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (path: string) => location.pathname === path

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B0E11', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 py-4">
          <nav className="w-fit mx-auto px-8 py-3 rounded-full border shadow-2xl" 
               style={{ backgroundColor: 'rgba(11, 14, 17, 0.95)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Database className="h-6 w-6" style={{ color: '#F0B90B' }} />
              <span className="text-lg font-bold" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                UNIDATA
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? 'text-black shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
                style={isActive('/') ? { backgroundColor: '#F0B90B', fontWeight: '500' } : {}}
              >
                Home
              </Link>
              
              <Link
                to="/datasets"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive('/datasets')
                    ? 'text-black shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
                style={isActive('/datasets') ? { backgroundColor: '#F0B90B', fontWeight: '500' } : {}}
              >
                Datasets
              </Link>

              <Link
                to="/models"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive('/models')
                    ? 'text-black shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
                style={isActive('/models') ? { backgroundColor: '#F0B90B', fontWeight: '500' } : {}}
              >
                Models
              </Link>
              
              <Link
                to="/marketplace"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive('/marketplace')
                    ? 'text-black shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
                style={isActive('/marketplace') ? { backgroundColor: '#F0B90B', fontWeight: '500' } : {}}
              >
                Marketplace
              </Link>

              <div className="relative group">
                <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-white/70 hover:text-white">
                  Upload
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    to="/upload-dataset"
                    className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors rounded-t-lg"
                  >
                    <Database className="h-4 w-4 inline mr-2" />
                    Upload Dataset
                  </Link>
                  <Link
                    to="/upload-model"
                    className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors rounded-b-lg"
                  >
                    <Brain className="h-4 w-4 inline mr-2" />
                    Upload Model
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side - Wallet */}
            <div className="flex items-center space-x-3">
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-colors" 
                      style={{ backgroundColor: 'rgba(240, 185, 11, 0.2)', borderColor: 'rgba(240, 185, 11, 0.3)' }}
                    >
                      <Wallet className="h-4 w-4" style={{ color: '#F0B90B' }} />
                      <span className="text-xs font-medium" style={{ color: '#F0B90B' }}>
                        {formatAddress(account!)}
                      </span>
                      <ChevronDown className="h-3 w-3" style={{ color: '#F0B90B' }} />
                    </button>
                    
                    {/* Account Switcher Dropdown */}
                    {showAccountSwitcher && (
                      <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl z-50">
                        <div className="p-4">
                          <AccountSwitcher />
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnect}
                    className="px-3 py-1.5 text-xs rounded-full border hover:bg-white/5"
                    style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF' }}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={connect}
                  disabled={isConnecting}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium hover:opacity-90"
                  style={{ backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' }}
                >
                  <Wallet className="h-4 w-4" />
                  <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
                </Button>
              )}
            </div>
          </div>
        </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 flex items-center justify-center">
            <nav className="w-fit mx-auto px-6 py-2 rounded-full border shadow-xl"
                 style={{ backgroundColor: 'rgba(11, 14, 17, 0.95)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200`}
                  style={isActive('/') ? 
                    { backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' } : 
                    { color: 'rgba(255, 255, 255, 0.7)' }
                  }
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                
                <Link
                  to="/datasets"
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200`}
                  style={isActive('/datasets') ? 
                    { backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' } : 
                    { color: 'rgba(255, 255, 255, 0.7)' }
                  }
                >
                  <Database className="h-4 w-4" />
                  <span>Data</span>
                </Link>
                
                <Link
                  to="/models"
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200`}
                  style={isActive('/models') ? 
                    { backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' } : 
                    { color: 'rgba(255, 255, 255, 0.7)' }
                  }
                >
                  <Brain className="h-4 w-4" />
                  <span>Models</span>
                </Link>
                
                <Link
                  to="/marketplace"
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200`}
                  style={isActive('/marketplace') ? 
                    { backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' } : 
                    { color: 'rgba(255, 255, 255, 0.7)' }
                  }
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Market</span>
                </Link>

                <Link
                  to="/upload-dataset"
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200`}
                  style={isActive('/upload-dataset') || isActive('/upload-model') ? 
                    { backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' } : 
                    { color: 'rgba(255, 255, 255, 0.7)' }
                  }
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Link>
              </div>
            </nav>
          </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Database className="h-6 w-6" style={{ color: '#F0B90B' }} />
              <span className="text-lg font-semibold" style={{ color: '#FFFFFF', fontWeight: '700' }}>UNIDATA</span>
            </div>
            
            <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <p>Decentralized data marketplace powered by BNB Smart Chain</p>
            </div>
            
            <div className="text-sm mt-4 md:mt-0" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              <p>&copy; 2025 UNIDATA. Built with ❤️ for Web3</p>
            </div>
          </div>
        </div>
        </footer>
        
        <FloatingActionButton />
      </div>
    </div>
  )
}
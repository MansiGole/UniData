import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { useWallet } from '../../hooks/useWallet'
import { Wallet, Home, ShoppingCart, Upload, Brain, ChevronDown, Database } from 'lucide-react'
import FloatingActionButton from '../FloatingActionButton'
import AccountSwitcher from '../AccountSwitcher'
import { Logo } from '../ui/Logo'

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
            <Link to="/" className="flex items-center">
              <Logo size="sm" />
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
      <footer className="border-t mt-16" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(11, 14, 17, 0.5)' }}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Logo size="sm" />
                <span className="text-lg font-semibold" style={{ color: '#FFFFFF', fontWeight: '700' }}>UNIDATA</span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                The decentralized data marketplace for AI researchers and data scientists. 
                Powered by BNB Smart Chain for secure, transparent transactions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/datasets" className="text-sm text-white/70 hover:text-white transition-colors">Browse Datasets</Link></li>
                <li><Link to="/models" className="text-sm text-white/70 hover:text-white transition-colors">Explore Models</Link></li>
                <li><Link to="/marketplace" className="text-sm text-white/70 hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link to="/upload-dataset" className="text-sm text-white/70 hover:text-white transition-colors">Upload Dataset</Link></li>
                <li><Link to="/upload-model" className="text-sm text-white/70 hover:text-white transition-colors">Upload Model</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Smart Contracts</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">BNB Greenfield</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Community */}
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#FFFFFF' }}>Community</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Newsletter</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t mt-8 pt-8" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-sm mb-4 md:mb-0" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <p>&copy; 2025 UNIDATA. Built for Web3. All rights reserved.</p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
        
        <FloatingActionButton />
      </div>
    </div>
  )
}
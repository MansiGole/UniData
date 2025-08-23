import React, { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Wallet, CheckCircle, XCircle, AlertCircle, Network, DollarSign } from 'lucide-react'

export const WalletTestPage: React.FC = () => {
  const { account, isConnected, isConnecting, provider, balance, networkInfo, connect, disconnect } = useWallet()
  const [networkDetails, setNetworkDetails] = useState<any>(null)
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean
    isCorrectAddress: boolean
    expectedAddress: string
  } | null>(null)

  const expectedWalletAddress = "0x9ed8454F21BE1Ec34cd17e6C6abdF9CD8EE2C6b9"

  // Validate the connected address
  useEffect(() => {
    if (account) {
      const isValid = /^0x[a-fA-F0-9]{40}$/.test(account)
      const isCorrectAddress = account.toLowerCase() === expectedWalletAddress.toLowerCase()
      
      setAddressValidation({
        isValid,
        isCorrectAddress,
        expectedAddress: expectedWalletAddress
      })
    } else {
      setAddressValidation(null)
    }
  }, [account])

  // Get network details
  useEffect(() => {
    const getNetworkDetails = async () => {
      if (provider) {
        try {
          const network = await provider.getNetwork()
          const blockNumber = await provider.getBlockNumber()
          
          setNetworkDetails({
            chainId: Number(network.chainId),
            name: network.name,
            blockNumber: blockNumber,
            isCorrectNetwork: Number(network.chainId) === 97 // BNB Testnet
          })
        } catch (error) {
          console.error('Failed to get network details:', error)
        }
      }
    }
    
    if (provider) {
      getNetworkDetails()
    }
  }, [provider])

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center">
            <Wallet className="h-8 w-8 mr-3 text-primary" />
            MetaMask Connection Test
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive validation of MetaMask wallet connection and configuration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Connection Status
              </CardTitle>
              <CardDescription>
                Current wallet connection state
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>MetaMask Installed</span>
                {getStatusIcon(!!window.ethereum)}
                <span className={getStatusColor(!!window.ethereum)}>
                  {window.ethereum ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Wallet Connected</span>
                {getStatusIcon(isConnected)}
                <span className={getStatusColor(isConnected)}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Connecting</span>
                {isConnecting ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className={isConnecting ? 'text-yellow-600' : 'text-gray-600'}>
                  {isConnecting ? 'In Progress...' : 'Idle'}
                </span>
              </div>

              <div className="pt-4">
                {!isConnected ? (
                  <Button 
                    onClick={connect} 
                    disabled={isConnecting || !window.ethereum}
                    className="w-full"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                  </Button>
                ) : (
                  <Button 
                    onClick={disconnect} 
                    variant="outline"
                    className="w-full"
                  >
                    Disconnect Wallet
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Validation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Address Validation
              </CardTitle>
              <CardDescription>
                Verification of wallet address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {account ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Connected Address</label>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1 break-all">
                      {account}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expected Address</label>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1 break-all">
                      {expectedWalletAddress}
                    </p>
                  </div>

                  {addressValidation && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Valid Format</span>
                        {getStatusIcon(addressValidation.isValid)}
                        <span className={getStatusColor(addressValidation.isValid)}>
                          {addressValidation.isValid ? 'Valid' : 'Invalid'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Correct Address</span>
                        {getStatusIcon(addressValidation.isCorrectAddress)}
                        <span className={getStatusColor(addressValidation.isCorrectAddress)}>
                          {addressValidation.isCorrectAddress ? 'Match' : 'Mismatch'}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No wallet connected</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Network Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="h-5 w-5 mr-2" />
                Network Details
              </CardTitle>
              <CardDescription>
                Current blockchain network information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {networkDetails ? (
                <>
                  <div className="flex items-center justify-between">
                    <span>Chain ID</span>
                    <span className="font-mono">{networkDetails.chainId}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Network Name</span>
                    <span>{networkDetails.name || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Block Number</span>
                    <span className="font-mono">{networkDetails.blockNumber}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Correct Network</span>
                    {getStatusIcon(networkDetails.isCorrectNetwork)}
                    <span className={getStatusColor(networkDetails.isCorrectNetwork)}>
                      {networkDetails.isCorrectNetwork ? 'BNB Testnet' : 'Wrong Network'}
                    </span>
                  </div>
                  
                  {!networkDetails.isCorrectNetwork && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-sm text-yellow-800">
                        Please switch to BNB Smart Chain Testnet (Chain ID: 97)
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Network information not available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Balance Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Balance & Backend
              </CardTitle>
              <CardDescription>
                Wallet balance and backend connectivity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConnected ? (
                <>
                  <div className="flex items-center justify-between">
                    <span>tBNB Balance</span>
                    <span className="font-mono">
                      {balance !== null ? `${parseFloat(balance).toFixed(4)} tBNB` : 'Loading...'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Backend Connection</span>
                    {getStatusIcon(networkInfo !== null)}
                    <span className={getStatusColor(networkInfo !== null)}>
                      {networkInfo ? 'Connected' : 'Failed'}
                    </span>
                  </div>
                  
                  {networkInfo && (
                    <div className="text-xs text-muted-foreground">
                      <p>Network Info: {JSON.stringify(networkInfo)}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Connect wallet to view balance</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Overall Status Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Connection Summary</CardTitle>
            <CardDescription>
              Overall validation status for your MetaMask setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected && addressValidation && networkDetails ? (
              <div className="space-y-2">
                {addressValidation.isCorrectAddress && networkDetails.isCorrectNetwork ? (
                  <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                    <div>
                      <p className="font-semibold text-green-800">✅ MetaMask Setup Valid</p>
                      <p className="text-sm text-green-600">
                        Correct wallet address connected to BNB Testnet. Ready to use the marketplace!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-yellow-500 mr-3" />
                    <div>
                      <p className="font-semibold text-yellow-800">⚠️ Configuration Issues</p>
                      <p className="text-sm text-yellow-600">
                        {!addressValidation.isCorrectAddress && 'Wrong wallet address. '}
                        {!networkDetails.isCorrectNetwork && 'Wrong network selected. '}
                        Please check your MetaMask configuration.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <AlertCircle className="h-6 w-6 text-gray-500 mr-3" />
                <div>
                  <p className="font-semibold text-gray-800">Connect MetaMask</p>
                  <p className="text-sm text-gray-600">
                    Please connect your MetaMask wallet to validate the setup.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WalletTestPage

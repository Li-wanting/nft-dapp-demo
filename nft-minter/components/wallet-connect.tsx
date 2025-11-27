"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Wallet, ChevronDown, Copy, CheckCircle2 } from "lucide-react"

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [network, setNetwork] = useState("Ethereum Mainnet")
  const [balance, setBalance] = useState("0.0")
  const [copied, setCopied] = useState(false)

  const handleConnect = () => {
    // 模拟钱包连接
    setIsConnected(true)
    setWalletAddress("0x1234...5678")
    setBalance("2.45")
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setWalletAddress("")
    setBalance("0.0")
  }

  const handleCopyAddress = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNetwork(e.target.value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-purple-600" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your wallet to start minting NFTs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <Button onClick={handleConnect} size="lg" className="w-full">
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
              <Badge variant="success" className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Connected
              </Badge>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wallet Address</span>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-purple-50 px-4 py-2 text-sm font-mono text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {walletAddress}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyAddress}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Network Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Network</label>
              <Select value={network} onChange={handleNetworkChange}>
                <option value="Ethereum Mainnet">Ethereum Mainnet</option>
                <option value="Polygon">Polygon</option>
                <option value="BSC">Binance Smart Chain</option>
                <option value="Arbitrum">Arbitrum</option>
                <option value="Optimism">Optimism</option>
              </Select>
            </div>

            {/* Balance */}
            <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Balance</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {balance} ETH
              </div>
            </div>

            {/* Disconnect Button */}
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Wallet, ChevronDown, Copy, CheckCircle2 } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useDisconnect,
  useBalance,
  useWatchBlocks,
  useAccountEffect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { formatUnits } from "viem";

export function WalletConnect() {
  const [copied, setCopied] = useState(false);

  const { openConnectModal } = useConnectModal();

  const {
    // 钱包地址
    address: walletAddress,
    // 已连接状态
    isConnected,
    // 连接中状态
    isConnecting,
  } = useAccount();
  const chainId = useChainId();
  const { data: balance, refetch } = useBalance({
    address: walletAddress,
  });
  const { chains, switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();

  // balance.formatted 被官方废弃，改用下面的方式格式化余额
  const formattedBalance = balance
    ? formatUnits(balance.value, balance.decimals)
    : "0";

  console.log("status", isConnected, isConnecting, chainId, formattedBalance);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchChain({
      chainId: +e.target.value,
    });
  };

  useWatchBlocks({
    onBlock: () => refetch(), // 每次新区块 => 刷新余额
  });

  useAccountEffect({
    onConnect(data) {
      // 当钱包连接成功时触发
      console.log("Connected!", data);
    },
    // 当钱包断开连接时触发
    onDisconnect() {
      console.log("Disconnected!");
    },
  });

  return (
    <Card>
      {/* 默认连接按钮，（用作对比） */}
      {/* <ConnectButton /> */}
      {/*  */}

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
        {isConnecting ? (
          <div className="text-center text-gray-600 dark:text-gray-300">
            Connecting to wallet...
          </div>
        ) : !isConnected && openConnectModal ? (
          <Button onClick={openConnectModal} size="lg" className="w-full">
            {/* 使用Modal hook唤起连接窗口 */}
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </span>
              <Badge variant="success" className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Connected
              </Badge>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Wallet Address
              </span>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-purple-50 px-4 py-2 text-sm font-mono text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
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
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Network
              </label>
              <Select value={chainId} onChange={handleNetworkChange}>
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Balance */}
            <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Current Balance
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {formattedBalance} {balance?.symbol}
              </div>
            </div>

            {/* Disconnect Button */}
            <Button
              variant="outline"
              onClick={() => disconnect()}
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

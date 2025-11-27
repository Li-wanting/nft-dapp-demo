"use client"
import { WalletConnect } from "@/components/wallet-connect"
import { NftMintForm } from "@/components/nft-mint-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 animate-gradient transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-purple-100 dark:border-purple-900 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  NFT Minter
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create your digital masterpiece</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-sm font-medium">
                <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
                Ready to Mint
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
              Mint Your NFT in Minutes
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Connect your wallet, add your artwork details, and bring your digital creation to life on the blockchain
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Wallet Connection */}
            <div className="space-y-6">
              <WalletConnect />
              
              {/* Info Card */}
              <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 p-6 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Why Mint with Us?
                </h3>
                <ul className="space-y-2 text-sm text-purple-50 dark:text-purple-100">
                  <li className="flex items-start gap-2">
                    <span className="text-white">✨</span>
                    <span>Simple and intuitive minting process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white">🔒</span>
                    <span>Secure and decentralized storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white">⚡</span>
                    <span>Fast transactions with low gas fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white">🌍</span>
                    <span>Multi-chain support for flexibility</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - NFT Mint Form */}
            <div>
              <NftMintForm />
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              This is a demo interface for learning Web3 development. 
              No actual blockchain transactions will be performed.
            </p>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-20 dark:opacity-10 animate-blob pointer-events-none" />
      <div className="fixed top-40 right-10 w-72 h-72 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="fixed bottom-20 left-1/2 w-72 h-72 bg-orange-300 dark:bg-orange-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000 pointer-events-none" />

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

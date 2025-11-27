"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Image as ImageIcon, FileText, AlertCircle } from "lucide-react"

export function NftMintForm() {
  const [formData, setFormData] = useState({
    imageUrl: "",
    name: "",
    description: ""
  })
  const [isMinting, setIsMinting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMint = async () => {
    setIsMinting(true)
    // 模拟 mint 过程
    setTimeout(() => {
      setIsMinting(false)
      alert("NFT Minted Successfully! (This is a demo)")
    }, 2000)
  }

  const isFormValid = formData.imageUrl && formData.name && formData.description

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          Mint Your NFT
        </CardTitle>
        <CardDescription>
          Fill in the metadata for your unique digital asset
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image URL Input */}
        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-purple-600" />
            Image URL
          </Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://example.com/your-nft-image.png"
            value={formData.imageUrl}
            onChange={handleInputChange}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter the URL of your NFT image (IPFS, Arweave, or HTTP)
          </p>
        </div>

        {/* Image Preview */}
        {formData.imageUrl && (
          <div className="rounded-lg border-2 border-purple-100 dark:border-purple-900 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4">
            <div className="aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-lg">
              <img
                src={formData.imageUrl}
                alt="NFT Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400"><ImageIcon class="h-16 w-16" /></div>'
                }}
              />
            </div>
          </div>
        )}

        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-600" />
            NFT Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="My Awesome NFT"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-600" />
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your NFT, its story, rarity, or any special features..."
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
          />
        </div>

        {/* Info Alert */}
        {!isFormValid && (
          <div className="flex gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-100 dark:border-purple-900">
            <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div className="text-sm text-purple-900 dark:text-purple-100">
              <p className="font-medium mb-1">Complete all fields</p>
              <p className="text-purple-700 dark:text-purple-300">
                Please fill in all the required fields to mint your NFT
              </p>
            </div>
          </div>
        )}

        {/* Mint Button */}
        <Button
          onClick={handleMint}
          disabled={!isFormValid || isMinting}
          size="lg"
          className="w-full text-base font-semibold"
        >
          {isMinting ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Minting...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Mint NFT
            </>
          )}
        </Button>

        {/* Gas Fee Estimate (Mock) */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Estimated gas fee: <span className="font-medium text-purple-600 dark:text-purple-400">~0.005 ETH</span></p>
        </div>
      </CardContent>
    </Card>
  )
}


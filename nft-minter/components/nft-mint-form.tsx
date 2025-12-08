"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { createNFTMetadata } from "@/lib/metadata";
import { useAccount } from "wagmi";
import { useNFTMint } from "@/app/hooks/useNFTMint";
import { explorers } from "@/lib/contract";
import { useMintEstimateGas } from "@/app/hooks/useMintEstimateGas";

// Mint 步骤枚举映射
const MINT_STEP = {
  idle: "idle", // 空闲
  metadataUploading: "uploading-metadata", //元数据上传中
  minting: "minting", //交易发起中（与合约交互中）
  confirming: "confirming", // 用户确认交易中
  success: "success", // 交易成功
  error: "error", // 交易失败
};

// Mint 步骤提示信息枚举映射
const MINT_STEP_MSG = {
  [MINT_STEP.confirming]: "Waiting for confirmation...",
  [MINT_STEP.metadataUploading]: "Uploading metadata to IPFS...",
  [MINT_STEP.minting]: "Submitting transaction...",
};

export function NftMintForm() {
  const [formData, setFormData] = useState({
    imageUrl: "",
    name: "",
    description: ""
  })
  const [mintStep, setMintStep] = useState<string>(MINT_STEP.idle);
  const [tokenURI, setTokenURI] = useState<string>("");

  const { isConnected, chainId } = useAccount();
  const {
    contractAddress,
    mintNFT,
    hash,
    isWriting,
    isConfirming,
    isConfirmed,
    receipt,
    writeError,
    receiptError,
  } = useNFTMint();
  const { gasEstimate, isEstimatingGas, gasFeeETH, gasFeeWei } =
    useMintEstimateGas(tokenURI);

  // console.log('useNFTMint',{
  //   contractAddress,
  //   mintNFT,
  //   hash,
  //   isWriting,
  //   isConfirming,
  //   isConfirmed,
  //   receipt,
  //   writeError,
  //   receiptError,
  //   gasEstimate
  // })

  // 断开钱包连接 清空表单数据
  useEffect(() => {
    if (!isConnected) {
      setFormData({
        imageUrl: "",
        name: "",
        description: "",
      });
    }
  }, [isConnected]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 上传元数据到IPFS
  const uploadMetadata = async (): Promise<string> => {
    const metadata = createNFTMetadata(
      formData.name,
      formData.description,
      formData.imageUrl
    );
    const res = await fetch("/api/pinata/pinJSONToIPFS", {
      method: "POST",
      body: JSON.stringify(metadata),
    });
    const { success, data } = await res.json();
    if (!success) {
      throw new Error("Failed to upload metadata to IPFS");
    }
    return data.ipfsUrl;
  };

  // 完整的 Mint 流程
  const handleMint = async () => {
    try {
      setMintStep(MINT_STEP.metadataUploading);
      // 上传元数据到IPFS
      const metadataURI = await uploadMetadata();
      setTokenURI(metadataURI);
      console.log("metadataURI", metadataURI);

      // 调用合约Mint函数
      setMintStep(MINT_STEP.minting);
      await mintNFT(metadataURI);
    } catch (error) {
      console.error("error", error);
      setMintStep(MINT_STEP.error);
    }
  };

  // 监听交易步骤变化
  const mintStepMemo = useMemo(() => {
    if (mintStep === MINT_STEP.metadataUploading)
      return MINT_STEP.metadataUploading;
    if (isWriting) return MINT_STEP.minting;
    if (isConfirming) return MINT_STEP.confirming;
    if (isConfirmed) return MINT_STEP.success;
    if (writeError || receiptError || mintStep === MINT_STEP.error)
      return MINT_STEP.error;
    return MINT_STEP.idle;
  }, [
    mintStep,
    isWriting,
    isConfirming,
    isConfirmed,
    writeError,
    receiptError,
  ]);

  // 监听错误信息
  const errorMsgMemo = useMemo(() => {
    const error = writeError || receiptError;
    if (!contractAddress) return "Contract not deployed on this network";

    if (error?.message.includes("User rejected"))
      return "Transaction rejected by user";

    if (error?.message.includes("insufficient funds"))
      return "Insufficient funds for gas";

    return error?.message || "Transaction failed";
  }, [writeError, receiptError, contractAddress]);

  // 是否处于minting中
  const isMinting = useMemo(
    () =>
      [
        MINT_STEP.metadataUploading,
        MINT_STEP.minting,
        MINT_STEP.confirming,
      ].includes(mintStepMemo),
    [mintStepMemo]
  );

  // 表单完整性校验
  const isFormValid = useMemo(
    () => formData.imageUrl && formData.name && formData.description,
    [formData]
  );

  // 图片预览的url，如果是ipfs协议格式的url需要转换成浏览器可访问的格式
  const imgPreviewUrl = useMemo(() => {
    const url = formData.imageUrl;
    if (url.startsWith("ipfs://")) {
      const hash = url.replace("ipfs://", "");
      return `https://ipfs.io/ipfs/${hash}`;
    }
    return url;
  }, [formData.imageUrl]);

  // 获取区块浏览器链接
  const getExplorerUrl = (txHash: string) => {
    return `${explorers[chainId || 11155111]}/${txHash}`;
  };

  // 连接钱包提示
  if (!isConnected) {
    return (
      <div className="flex gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-900 dark:text-yellow-100">
          <p className="font-medium mb-1">Wallet not connected</p>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please connect your wallet to mint NFTs
          </p>
        </div>
      </div>
    );
  }

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
        {/* 错误提示 */}
        {mintStepMemo === "error" && errorMsgMemo && (
          <div className="flex gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-900 dark:text-red-100">
              <p className="font-medium mb-1">Mint Failed</p>
              <p className="text-red-700 dark:text-red-300">{errorMsgMemo}</p>
            </div>
          </div>
        )}

        {/* 进度指示器 */}
        {isMinting && (
          <div className="space-y-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-purple-600 dark:text-purple-400 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  {MINT_STEP_MSG[mintStepMemo]}
                </p>
                {hash && mintStepMemo === MINT_STEP.confirming && (
                  <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                    Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 交易状态显示 */}
        {mintStepMemo === "success" && hash && (
          <div className="flex gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-green-900 dark:text-green-100">
              <p className="font-medium mb-2">NFT Minted Successfully! 🎉</p>
              <div className="space-y-1">
                <p className="text-xs text-green-700 dark:text-green-300">
                  Transaction Hash:
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-green-100 dark:bg-green-900 px-2 py-1 rounded break-all">
                    {hash}
                  </code>
                  <a
                    href={getExplorerUrl(hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                {receipt && (
                  <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                    Token ID:{" "}
                    {receipt.logs[0]?.topics[3]
                      ? BigInt(receipt.logs[0].topics[3]).toString()
                      : "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

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
            disabled={isMinting}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter the URL of your NFT image (IPFS, Arweave, or HTTP)
          </p>
        </div>

        {/* Image Preview */}
        {imgPreviewUrl && (
          <div className="rounded-lg border-2 border-purple-100 dark:border-purple-900 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4">
            <div className="aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-lg">
              <img
                src={imgPreviewUrl}
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
            disabled={isMinting}
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
            disabled={isMinting}
          />
        </div>

        {/* Info Alert */}
        {!isFormValid && mintStepMemo === MINT_STEP.idle && (
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

        {/* Gas Fee Estimate */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Estimated gas fee:{" "}
            {isEstimatingGas ? (
              <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
            ) : (
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                ~{gasEstimate ? gasFeeETH : 0} ETH
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

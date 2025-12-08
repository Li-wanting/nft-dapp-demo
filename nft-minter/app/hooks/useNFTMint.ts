import { getContractAddress, NFT_CONTRACT_ABI } from "@/lib/contract";
import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export const useNFTMint = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddress = getContractAddress(chainId || 0);

  // 使用 useWriteContract 钩子调用合约函数
  const {
    writeContract,
    data: hash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  // 等待交易确认钩子
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Mint NFT 函数
  const mintNFT = async (tokenURI: string) => {
    // 确保合约地址和用户地址存在
    if (!contractAddress) {
      throw new Error("Contract not deployed on this network");
    }

    if (!address) {
      throw new Error("Wallet not connected");
    }

    // 调用合约的 mint 函数
    writeContract({
      address: contractAddress,
      abi: NFT_CONTRACT_ABI,
      functionName: "mint",
      args: [address, tokenURI],// mint 函数需要的参数
    });
  };

  return {
    mintNFT,
    hash,
    receipt,
    isWriting,
    isConfirming,
    isConfirmed,
    writeError,
    receiptError,
    contractAddress,
  };
};

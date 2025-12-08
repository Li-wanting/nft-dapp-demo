import { getContractAddress, NFT_CONTRACT_ABI } from "@/lib/contract";
import { encodeFunctionData, formatEther } from "viem";
import { useAccount, useChainId, useEstimateGas, useGasPrice } from "wagmi";

export const useMintEstimateGas = (tokenURI: string) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddress = getContractAddress(chainId || 0);

  // 如果address不存在，传入安全默认值
  const calldata =
    address && tokenURI
      ? encodeFunctionData({
          abi: NFT_CONTRACT_ABI,
          functionName: "mint",
          args: [address, tokenURI],
        })
      : "0x";
  // 使用 useEstimateGas 钩子 获取 gas数量 和 估算状态
  const { data: gasEstimate, isLoading: isEstimatingGas } = useEstimateGas({
    to: contractAddress || undefined,
    account: address || undefined,
    data: calldata,
  });

  // 使用 useGasPrice 钩子获取 gasPrice
  const { data: gasPrice } = useGasPrice();

  // 最终费用（wei）
  const gasFeeWei =
    gasEstimate && gasPrice ? gasEstimate * gasPrice : BigInt(0);

  // 最终费用（ETH）
  const gasFeeETH = formatEther(gasFeeWei);

  return {
    gasEstimate: gasEstimate || BigInt(0),
    isEstimatingGas,
    gasFeeWei,
    gasFeeETH,
  };
};

import { mainnet, sepolia } from "wagmi/chains";
import ABI from "./contract-abi.json";

// 区块浏览器链接
export const explorers: Record<number, string> = {
  [mainnet.id]: `https://etherscan.io/tx`,
  [sepolia.id]: `https://sepolia.etherscan.io/tx`,
};

// 合约 ABI
export const NFT_CONTRACT_ABI = ABI;

// 合约地址映射，根据不同网络ID使用不同地址
export const NFT_CONTRACT_ADDRESS = {
  [sepolia.id]: process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS as `0x${string}`, // "0xYourSepoliaContractAddressHere"
  [mainnet.id]: "0xYourMainnetContractAddressHere",
} as const;

// 根据链 ID 获取对应的合约地址
export const getContractAddress = (
  chainId: number
): `0x${string}` | undefined => {
  return (
    NFT_CONTRACT_ADDRESS[chainId as keyof typeof NFT_CONTRACT_ADDRESS] ||
    undefined
  );
};

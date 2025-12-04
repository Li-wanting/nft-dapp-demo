export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URL
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export const createNFTMetadata = (
  name: string,
  description: string,
  imageUrl: string
): NFTMetadata => {
  return {
    name,
    description,
    image: imageUrl, // 已经是 IPFS URL
    // 可选：添加 attributes
  };
};

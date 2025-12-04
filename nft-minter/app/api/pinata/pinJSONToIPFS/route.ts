import { pinata } from "@/lib/pinata";
import { NextRequest, NextResponse } from "next/server";
import { UploadResponse } from "pinata";

// 将 JSON 元数据上传到 Pinata
/// example metadata:
// {
//   "name": "My NFT",
//   "description": "This is my first NFT",
//   "image": "ipfs://bafkreighjxt47fqbf3zu3f7f6ayirc6gw2uaqbhpmrgmtuqplrnbnbwdli"
// }
export const POST = async (req: NextRequest) => {
  try {
    const metadata = await req.json();
    // 调用 Pinata V3 SDK: https://docs.pinata.cloud/sdk/upload/public/json
    const update: UploadResponse = await pinata.upload.public.json(metadata);
    console.log("pinJSONToIPFS update:", update);

    // ipfs url 格式
    const ipfsUrl = `ipfs://${update.cid}`;
    // gateway url 格式 可以直接在浏览器打开查看
    const gatewayUrl = `https://${process.env.PINATA_GATEWAY}/ipfs/${update.cid}`;

    return NextResponse.json({
      success: true,
      data: {
        cid: update.cid,
        ipfsUrl,
        gatewayUrl,
      },
    });
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to upload to IPFS",
    });
  }
};

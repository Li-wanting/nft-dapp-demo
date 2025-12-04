import { pinata } from "@/lib/pinata";
import { NextRequest, NextResponse } from "next/server";
import { UploadResponse } from "pinata";

// 将文件上传到 Pinata
export const POST = async (req: NextRequest) => {
  try {
    const file = await req.formData();
    // 调用 Pinata V3 SDK: https://docs.pinata.cloud/sdk/upload/public/file
    const update:UploadResponse = await pinata.upload.public.file(file.get("file") as File);
    console.log("pinFileToIPFS update:", update);

    const ipfsUrl = `ipfs://${update.cid}`;
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

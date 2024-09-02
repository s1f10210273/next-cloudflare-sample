import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFileData = formData.get("imageFileData") as File;
    const imageFileDataArrayBuffer = await imageFileData.arrayBuffer();
    const imageFileDataBuffer = Buffer.from(imageFileDataArrayBuffer);

    const s3 = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
      },
    });

    const key = `${Date.now()}_${imageFileData.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: "test2",
        Key: key,
        ContentType: imageFileData.type,
        Body: imageFileDataBuffer,
      })
    );

    const uploadedUrlUse = `${process.env.R2_BUCKET_URL}/${key}`;

    return NextResponse.json({
      message: "アップロードに成功しました。",
      url: uploadedUrlUse,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        message: "アップロードに失敗しました。",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

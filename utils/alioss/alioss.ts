import OSS from "ali-oss";
export const client = new OSS({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  accessKeySecret: process.env.NEXT_PUBLIC_ACCESS_KEY_SECRET,
  bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
  region: process.env.NEXT_PUBLIC_REGION
})

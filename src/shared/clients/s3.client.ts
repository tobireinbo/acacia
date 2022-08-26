import { S3 } from "aws-sdk";
export const s3Client = new S3({
  region: process.env.ACACIA_AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACACIA_AWS_KEY_ID,
    secretAccessKey: process.env.ACACIA_AWS_SECRET_KEY,
  },
});

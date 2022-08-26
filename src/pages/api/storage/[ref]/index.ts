import { StatusCodes } from "http-status-codes";
import { s3Client } from "src/shared/clients/s3.client";
import { queryHelper } from "src/shared/helper/query.helper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const ref = queryHelper.singleParam(req.query.ref);

    if (!ref) {
      return res.status(StatusCodes.BAD_REQUEST).send("missing file ref");
    }

    try {
      const url = await s3Client.getSignedUrlPromise("getObject", {
        Bucket: process.env.ACACIA_AWS_S3_BUCKET,
        Key: ref,
        Expires: 60 * 5, //5 minutes
      });

      return res.status(StatusCodes.OK).send(url);
    } catch {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("failed to retrieve file");
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
}

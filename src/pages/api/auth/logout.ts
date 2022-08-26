import { StatusCodes } from "http-status-codes";
import { authService } from "src/modules/auth/auth.service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    authService.removeTokenCookie(res);

    res.status(StatusCodes.NO_CONTENT).end();
  } else {
    res.status(StatusCodes.NOT_FOUND).end();
  }
}

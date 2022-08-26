import { StatusCodes } from "http-status-codes";
import { authService } from "src/modules/auth/auth.service";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const token = req.cookies.token;

      const user = authService.getUserByToken(token);

      res.status(StatusCodes.OK).json({ user });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Somethin Went Wrong!" });
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).send("Not Found");
  }
}

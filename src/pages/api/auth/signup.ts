import { StatusCodes } from "http-status-codes";
import { usersService } from "src/modules/users/users.service";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res
    .status(StatusCodes.SERVICE_UNAVAILABLE)
    .json({ message: "Signup has been disabled" });
  if (req.method === "POST") {
    try {
      const { email, password, firstname, lastname } = req.body;

      const user = await usersService.createOne(req, {
        firstname,
        lastname,
        password,
        email,
      });

      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
      }

      res.status(StatusCodes.CREATED).send(user);
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Something Went Wrong!" });
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).send("Not Found");
  }
}

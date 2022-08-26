import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { usersService } from "src/modules/users/users.service";
import { authService } from "src/modules/auth/auth.service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      const user = await usersService.findOneByLogin(req, { email, password });
      if (!user) {
        return res.status(400).send("Bad Request");
      }

      const token = await authService.generateUserToken(user);
      authService.setTokenCookie(res, token);

      res.status(StatusCodes.OK).send(user);
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  } else {
    res.status(404).send("Not Found");
  }
}

import { TOKEN_COOKIE_OPTIONS, TOKEN_KEY } from "./constants/token.constant";
import jwt from "jsonwebtoken";
import { User } from "src/modules/users/interfaces/user.interface";
import { NextApiResponse } from "next";
import cookie from "cookie";

function getUserByToken(token: string): User | undefined {
  const decoded = jwt.verify(token, process.env.ACACIA_JWT_SECRET);

  return typeof decoded !== "string" && decoded?.data?.user;
}

function generateUserToken(user: User) {
  return jwt.sign({ data: { user } }, process.env.ACACIA_JWT_SECRET, {
    expiresIn: TOKEN_COOKIE_OPTIONS.maxAge,
  });
}

function setTokenCookie(res: NextApiResponse, token: string) {
  res.setHeader(
    "set-cookie",
    cookie.serialize(TOKEN_KEY, token, TOKEN_COOKIE_OPTIONS)
  );
}

function removeTokenCookie(res: NextApiResponse) {
  res.setHeader(
    "set-cookie",
    cookie.serialize(TOKEN_KEY, "", { ...TOKEN_COOKIE_OPTIONS, maxAge: -1 })
  );
}

export const authService = {
  setTokenCookie,
  removeTokenCookie,
  generateUserToken,
  getUserByToken,
};

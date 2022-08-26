import { CookieSerializeOptions } from "next/dist/server/web/types";

export const TOKEN_COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 7, //1 week (ms * s * min * h * d)
  path: "/",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

export const TOKEN_KEY = "token";

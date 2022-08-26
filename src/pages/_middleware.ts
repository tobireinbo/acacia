import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: "/",
};

const WHITELIST = [
  "/api/graphql",
  "/auth/login",
  "/auth/signup",
  "/api/auth/login",
  "/api/auth/signup",
];

export function middleware(req: NextRequest) {
  const href = req.nextUrl.href;
  if (WHITELIST.some((entry) => req.nextUrl.origin + entry === href)) {
    return NextResponse.next();
  }
  const cookieToken = req.cookies?.token;

  if (!cookieToken) {
    const loginUrl = req.nextUrl.origin + "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

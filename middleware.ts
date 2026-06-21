import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((request) => {
  if (!request.auth) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    loginUrl.searchParams.set("message", "Please sign in to continue.");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/app", "/app/:path*", "/admin", "/admin/:path*"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hanko = request.cookies.get("hanko")?.value;

  // If there is no Hanko cookie and the user is trying to access /upload
  if (!hanko && request.nextUrl.pathname.startsWith("/upload")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/upload/:path*"],
};
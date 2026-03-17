import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as jose from "jose";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const hankoToken = cookieStore.get("hanko")?.value;

    // Return null user if no token exists (prevents console errors)
    if (!hankoToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (!hankoApi) {
      console.error("HANKO_API_URL is not defined");
      return NextResponse.json({ user: null }, { status: 500 });
    }

    const JWKS = jose.createRemoteJWKSet(
      new URL(`${hankoApi}/.well-known/jwks.json`)
    );

    const { payload } = await jose.jwtVerify(hankoToken, JWKS);

    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Hanko emails can be strings or objects { address: string, ... }.
    // We force it to a string here. 
    
    const emailData = payload.email as any;
    let displayEmail = "";

    if (typeof emailData === "string") {
      displayEmail = emailData;
    } else if (Array.isArray(emailData)) {
      displayEmail = emailData.find((e) => e.is_primary)?.address || emailData[0]?.address;
    } else if (emailData && typeof emailData === "object" && emailData.address) {
      displayEmail = emailData.address;
    } else {
      // Fallback to the subject (user ID) if no email is present
      displayEmail = (payload.sub as string) || "Unknown User";
    }

    return NextResponse.json({
      user: {
        id: payload.sub,
        email: displayEmail,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // If token is expired or invalid, return null without crashing
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const hankoToken = cookieStore.get("hanko")?.value;

    if (!hankoToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Mocking user data; in a real app, you might verify the JWT here
    const user = {
      id: "user",
      email: "user@example.com",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
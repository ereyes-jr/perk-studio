import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("hanko");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
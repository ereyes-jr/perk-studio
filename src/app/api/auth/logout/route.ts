import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Explicitly delete the hanko cookie
    cookieStore.set("hanko", "", { 
        path: "/", 
        maxAge: 0,
        expires: new Date(0) 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
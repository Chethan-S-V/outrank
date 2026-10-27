import { NextResponse } from "next/server";
import { signAdminToken, validateAdminCredentials, ADMIN_COOKIE_NAME } from "@/lib/auth/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, secret } = body;

    const isValid = validateAdminCredentials({ username, password, secret });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid administrator credentials. Access denied." },
        { status: 401 }
      );
    }

    const token = signAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "Administrator session established.",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}

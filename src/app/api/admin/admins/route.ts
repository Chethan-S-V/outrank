import { NextResponse } from "next/server";
import { AdminAuthorizationError, requireAdmin } from "@/lib/auth/admin";
import { createAdminAccount, listAdmins } from "@/lib/auth/admin-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const admins = listAdmins();
  return NextResponse.json({ admins });
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, email, password, role } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const admin = createAdminAccount({
      username,
      email,
      password,
      role: role || "moderator",
    });

    return NextResponse.json({ admin }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create administrator account." },
      { status: 400 }
    );
  }
}

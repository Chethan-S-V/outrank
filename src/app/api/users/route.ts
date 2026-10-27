import { NextResponse } from "next/server";
import { createUserProfile, listUsers, UserRegistrationError } from "@/services/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await createUserProfile(body);
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    if (error instanceof UserRegistrationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("User creation error:", error);
    return NextResponse.json(
      { error: "Unable to create user profile at this time." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const users = await listUsers(50);
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to list users:", error);
    return NextResponse.json(
      { error: "Unable to fetch users at this time." },
      { status: 500 },
    );
  }
}

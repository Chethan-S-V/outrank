import { eq, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema/users";
import { userRegistrationSchema } from "@/lib/validations/user";

export class UserRegistrationError extends Error {}

export async function createUserProfile(input: unknown) {
  const parsed = userRegistrationSchema.safeParse(input);
  if (!parsed.success) {
    throw new UserRegistrationError(
      parsed.error.issues[0]?.message || "Invalid user profile data.",
    );
  }

  const data = parsed.data;
  const db = getDb();

  // Check unique handle
  const [existingHandle] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.handle, data.handle.toLowerCase()))
    .limit(1);

  if (existingHandle) {
    throw new UserRegistrationError("This handle is already taken. Please choose another.");
  }

  // Check unique email
  const [existingEmail] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, data.email.toLowerCase()))
    .limit(1);

  if (existingEmail) {
    throw new UserRegistrationError("An account with this email address already exists.");
  }

  const [newUser] = await db
    .insert(users)
    .values({
      name: data.name,
      handle: data.handle.toLowerCase(),
      email: data.email.toLowerCase(),
      avatarUrl: data.avatarUrl || null,
      bio: data.bio || null,
      provider: data.provider || "manual",
      providerId: data.providerId || null,
      twitterHandle: data.twitterHandle || null,
      githubHandle: data.githubHandle || null,
      discordHandle: data.discordHandle || null,
      linkedinUrl: data.linkedinUrl || null,
    })
    .returning();

  return newUser;
}

export async function getUserByHandle(handle: string) {
  const db = getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.handle, handle.toLowerCase()))
    .limit(1);

  return user || null;
}

export async function listUsers(limit = 50) {
  const db = getDb();
  return db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit);
}

import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/db";
import { invitations } from "@/db/schema";
import { isServerAdminAuthenticated } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

type TargetInput = {
  email: string;
  name?: string;
  type?: "company" | "creator";
  websiteUrl?: string;
  categorySlug?: string;
};

export async function POST(request: Request) {
  const isAuth = await isServerAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      targets?: TargetInput[];
      bulkList?: string;
      targetType?: "company" | "creator";
      categorySlug?: string;
      personalNote?: string;
    };

    const targetType = body.targetType || "company";
    const defaultCategory = body.categorySlug || "coding-dev-tools";
    const personalNote = body.personalNote?.trim() || "";

    const parsedTargets: TargetInput[] = [];

    // 1. Process explicit targets
    if (Array.isArray(body.targets) && body.targets.length > 0) {
      for (const t of body.targets) {
        if (t.email && t.email.includes("@")) {
          parsedTargets.push({
            email: t.email.trim().toLowerCase(),
            name: t.name?.trim() || t.email.split("@")[0],
            type: t.type || targetType,
            websiteUrl: t.websiteUrl?.trim(),
            categorySlug: t.categorySlug || defaultCategory,
          });
        }
      }
    }

    // 2. Process bulk string list (newlines, commas, spaces)
    if (body.bulkList && typeof body.bulkList === "string") {
      const tokens = body.bulkList
        .split(/[\r\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      for (const token of tokens) {
        let email = "";
        let name = "";
        let website = "";

        if (token.includes("@")) {
          email = token.toLowerCase();
          const parts = email.split("@");
          const domain = parts[1];
          const rawName = domain.split(".")[0];
          name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          website = `https://${domain}`;
        } else if (token.includes(".")) {
          // Domain entered like "linear.app" or "netflix.com"
          const cleanDomain = token.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/.*$/, "");
          email = `partners@${cleanDomain}`;
          const rawName = cleanDomain.split(".")[0];
          name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          website = `https://${cleanDomain}`;
        }

        if (email && !parsedTargets.some((p) => p.email === email)) {
          parsedTargets.push({
            email,
            name,
            type: targetType,
            websiteUrl: website,
            categorySlug: defaultCategory,
          });
        }
      }
    }

    if (parsedTargets.length === 0) {
      return NextResponse.json(
        { error: "No valid email addresses or domains provided to invite." },
        { status: 400 }
      );
    }

    const db = getDb();
    const createdInvitations = [];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://outrank.world";

    for (const target of parsedTargets) {
      const inviteCode = `outrank_${crypto.randomBytes(12).toString("hex")}`;
      const vipLink = `${baseUrl}/claim/preview?websiteUrl=${encodeURIComponent(target.websiteUrl || `https://${target.email.split("@")[1]}`)}&name=${encodeURIComponent(target.name || "Showcase")}&categorySlug=${target.categorySlug || defaultCategory}&invite=${inviteCode}`;

      try {
        const [inserted] = await db
          .insert(invitations)
          .values({
            email: target.email,
            name: target.name || "Showcase",
            type: target.type || "company",
            websiteUrl: target.websiteUrl || null,
            categorySlug: target.categorySlug || defaultCategory,
            inviteCode,
            status: "sent",
            personalNote: personalNote || null,
          })
          .returning();

        // Server dispatch / email notification log
        console.log(`[OUTRANK OFFICIAL INVITATION DISPATCH]`);
        console.log(`To: ${target.name} <${target.email}>`);
        console.log(`Subject: Official Invitation: Claim #1 Rank on Outrank for ${target.name}`);
        console.log(`VIP Link: ${vipLink}`);
        if (personalNote) console.log(`Note: ${personalNote}`);

        createdInvitations.push({
          ...inserted,
          vipLink,
        });
      } catch (insertErr) {
        console.warn(`Skipping duplicate/invalid invite for ${target.email}:`, insertErr);
      }
    }

    return NextResponse.json({
      success: true,
      sentCount: createdInvitations.length,
      invitations: createdInvitations,
      message: `Successfully dispatched official VIP invitations to ${createdInvitations.length} recipients.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send invitations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

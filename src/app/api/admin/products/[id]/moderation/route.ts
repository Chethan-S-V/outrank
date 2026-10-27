import { NextResponse } from "next/server";
import { AdminAuthorizationError, requireAdmin } from "@/lib/auth/admin";
import { moderateProduct, ProductModerationError } from "@/services/products";

type ModerationRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: ModerationRouteContext,
) {
  try {
    await requireAdmin(request);
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  try {
    const { id } = await params;
    const product = await moderateProduct(id, body);

    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof ProductModerationError) {
      const statusByCode = {
        INVALID_INPUT: 400,
        PRODUCT_NOT_FOUND: 404,
        INVALID_TRANSITION: 400,
      } as const;

      return NextResponse.json(
        { error: error.message },
        { status: statusByCode[error.code] },
      );
    }

    console.error("Product moderation failed.", error);

    return NextResponse.json(
      { error: "Unable to update the product right now." },
      { status: 500 },
    );
  }
}

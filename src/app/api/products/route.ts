import { NextResponse } from "next/server";
import { createProduct, ProductSubmissionError } from "@/services/products";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  try {
    const product = await createProduct(body);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof ProductSubmissionError) {
      const statusByCode = {
        INVALID_INPUT: 400,
        CATEGORY_NOT_FOUND: 404,
        CATEGORY_INACTIVE: 400,
        DUPLICATE_PRODUCT: 409,
      } as const;

      return NextResponse.json(
        {
          error: error.message,
          fieldErrors: error.fieldErrors,
        },
        { status: statusByCode[error.code] },
      );
    }

    console.error("Product submission failed.", error);

    return NextResponse.json(
      { error: "Unable to submit the product right now." },
      { status: 500 },
    );
  }
}

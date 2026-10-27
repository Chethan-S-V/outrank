import { NextResponse } from "next/server";
import {
  ContributionRequestError,
  createContributionCheckout,
  PaymentConfigurationError,
} from "@/services/payments";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  try {
    const origin = new URL(request.url).origin;
    const session = await createContributionCheckout(body, { origin });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    if (error instanceof ContributionRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof PaymentConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    console.error("Contribution checkout could not be created.", error);
    return NextResponse.json(
      { error: "Unable to start checkout right now." },
      { status: 500 },
    );
  }
}

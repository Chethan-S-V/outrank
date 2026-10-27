import { NextResponse } from "next/server";
import type { HealthCheckResponse } from "@/types";

export function GET() {
  const response: HealthCheckResponse = {
    status: "ok",
    service: "outrank",
  };

  return NextResponse.json(response);
}

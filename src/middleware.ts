import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * OUTRANK ENTERPRISE WEB APPLICATION FIREWALL (WAF)
 * Deep Packet & URI Inspection against SQLi, XSS, RCE, Path Traversal, and Automated Hack Scanners.
 */

// 1. Blacklisted malicious automated hacker scanners & exploitation tools
const MALICIOUS_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /wpscan/i,
  /masscan/i,
  /acunetix/i,
  /nessus/i,
  /havij/i,
  /dirbuster/i,
  /nmap/i,
  /zgrab/i,
  /metasploit/i,
  /gobuster/i,
  /hydra/i,
];

// 2. High-threat attack vectors in URL, query parameters, and headers
const ATTACK_VECTORS = [
  // SQL Injection (SQLi) - targeted exploit keywords rather than single quotes or hash
  /\b(union\s+select|insert\s+into|drop\s+table|delete\s+from|update\s+\w+\s+set)\b/i,
  /\b(or\s+1\s*=\s*1|and\s+1\s*=\s*1|benchmark\s*\(|sleep\s*\()\b/i,
  /(--\s|;\s*drop|;\s*select|;\s*delete)/i,

  // Cross-Site Scripting (XSS)
  /<script[\s\S]*?>/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /\bon(load|error|click|mouseover|submit|focus)\s*=/i,
  /document\s*\.\s*(cookie|location|domain)/i,

  // Path Traversal & LFI
  /(\.\.\/|\.\.\\)/,
  /(\/etc\/passwd|\/etc\/shadow|\/proc\/self)/i,
  /(c:\\windows|boot\.ini)/i,

  // Remote Code Execution / Shell Injection
  /(\$\(|\`|\b(eval|system|exec|passthru|shell_exec)\s*\()/i,
  /(\b(cat|chmod|wget|curl|nc|bash|sh|cmd|powershell)\s+)/i,

  // Null Byte Injection
  /(%00|\0)/,
];

// Rate limiting in-memory bucket for API endpoints
const ipHitRegistry = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120; // 120 requests/min per IP
const MAX_LOGIN_ATTEMPTS_PER_WINDOW = 8; // 8 attempts/min for login

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  // Bypass static files and Next.js internal resources
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".jpg")
  ) {
    return NextResponse.next();
  }

  // --- FIREWALL CHECK 1: User-Agent Threat Filtering ---
  for (const botPattern of MALICIOUS_USER_AGENTS) {
    if (botPattern.test(userAgent)) {
      return new NextResponse(
        JSON.stringify({
          error: "Access Denied: Malicious scanner signature detected by Outrank Security Firewall.",
          status: 403,
          code: "WAF_SCANNER_BLOCKED",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Firewall-Status": "BLOCKED",
            "X-Firewall-Rule": "MALICIOUS_USER_AGENT",
          },
        }
      );
    }
  }

  // --- FIREWALL CHECK 2: Deep URL & Query Inspection ---
  const decodedUri = decodeURIComponent(pathname + search);
  for (const pattern of ATTACK_VECTORS) {
    // Check against high-threat vector matching
    if (pattern.test(decodedUri)) {
      return new NextResponse(
        JSON.stringify({
          error: "Forbidden: Malicious payload pattern intercepted by Outrank Web Application Firewall.",
          status: 403,
          code: "WAF_INJECTION_DETECTED",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Firewall-Status": "BLOCKED",
            "X-Firewall-Rule": "INJECTION_PATTERN_INTERCEPTED",
          },
        }
      );
    }
  }

  // --- FIREWALL CHECK 3: Rate Limiting / Anti-Brute-Force ---
  if (pathname.startsWith("/api/")) {
    const isLoginEndpoint = pathname.includes("/admin/login");
    const threshold = isLoginEndpoint ? MAX_LOGIN_ATTEMPTS_PER_WINDOW : MAX_REQUESTS_PER_WINDOW;
    const rateKey = `${clientIp}_${isLoginEndpoint ? "login" : "api"}`;
    const now = Date.now();

    const record = ipHitRegistry.get(rateKey) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    if (now > record.resetAt) {
      record.count = 1;
      record.resetAt = now + RATE_LIMIT_WINDOW_MS;
    } else {
      record.count += 1;
    }
    ipHitRegistry.set(rateKey, record);

    if (record.count > threshold) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests: Rate limit exceeded. Try again in 60 seconds.",
          status: 429,
          code: "WAF_RATE_LIMITED",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            "X-Firewall-Status": "RATE_LIMITED",
          },
        }
      );
    }
  }

  // --- FIREWALL CHECK 4: Inject Strict Production Security Headers ---
  const response = NextResponse.next();

  // Anti-Clickjacking: Allow same origin framing
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  // Anti-MIME sniffing: Prevent browser from interpreting files as a different MIME type
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Referrer Policy: Protect referrer leakage
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Cross-Site Scripting (XSS) Filter in legacy browsers
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // HSTS: Enforce HTTPS for 2 years with subdomains & preload
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Content Security Policy (CSP) - Configured for Razorpay & enterprise security
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: https://api.razorpay.com https://lumberjack.razorpay.com",
      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self' https://api.razorpay.com",
    ].join("; ")
  );

  // Permissions Policy: Enable payment for Razorpay checkout integration
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=*"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

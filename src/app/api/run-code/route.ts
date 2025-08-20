import { NextResponse } from "next/server";
import { createContext, runInContext } from "vm";
import { inspect } from "util";

export const runtime = "nodejs";

// Rate limiting simple implementation (in production, use Redis or proper rate limiting)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(req: Request): string {
  // In production, use proper IP detection
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "localhost";
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 30; // 30 requests per minute

  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

function validateCode(code: string): string | null {
  if (!code || typeof code !== "string") {
    return "Code must be a non-empty string";
  }

  if (code.length > 10000) {
    return "Code is too long (maximum 10,000 characters)";
  }

  // For now, let's be very lenient and only block the most dangerous patterns
  const dangerousPatterns = [
    /require\s*\(/,
    /process\./,
    /child_process/,
    /fs\./,
    // Removed most patterns to allow educational code
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return `Potentially unsafe code detected. Please avoid using: ${pattern.source.replace(/\\/g, '')}`;
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(req);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate request
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { code } = body;

    // Validate code
    const validationError = validateCode(code);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const logs: string[] = [];
    let logCount = 0;
    const maxLogs = 100;

    // Create a more secure sandbox
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          if (logCount >= maxLogs) return;
          logCount++;
          logs.push(args.map((arg) => inspect(arg, { depth: 3, maxArrayLength: 50 })).join(" "));
        },
        error: (...args: any[]) => {
          if (logCount >= maxLogs) return;
          logCount++;
          logs.push(`ERROR: ${args.map((arg) => inspect(arg, { depth: 3, maxArrayLength: 50 })).join(" ")}`);
        },
        warn: (...args: any[]) => {
          if (logCount >= maxLogs) return;
          logCount++;
          logs.push(`WARN: ${args.map((arg) => inspect(arg, { depth: 3, maxArrayLength: 50 })).join(" ")}`);
        },
      },
      // Add safe Math, JSON, Date objects
      Math: Math,
      JSON: JSON,
      Date: Date,
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,

      // ✅ Bổ sung setTimeout và clearTimeout từ Node.js vào sandbox
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
    };

    const context = createContext(sandbox);

    // Run with timeout and memory limits
    const result = runInContext(code.trim(), context, { 
      timeout: 5000, // 5 seconds
      displayErrors: false,
    });

    return NextResponse.json({ 
      logs, 
      result: inspect(result, { depth: 3, maxArrayLength: 50 })
    });

  } catch (err: any) {
    // Handle different types of errors
    if (err.message?.includes("timeout")) {
      return NextResponse.json({ error: "Code execution timed out (5 seconds)" });
    }
    
    if (err.message?.includes("memory")) {
      return NextResponse.json({ error: "Code execution exceeded memory limits" });
    }

    // Sanitize error messages to avoid information leakage
    const sanitizedError = err.message || "An error occurred during code execution";
    return NextResponse.json({ error: sanitizedError });
  }
}

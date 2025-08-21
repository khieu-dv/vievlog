import { NextResponse } from "next/server";

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

  if (code.length > 50000) {
    return "Code is too long (maximum 50,000 characters)";
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

    // Submit to Judge0 API
    const judge0Response = await fetch('https://api.vietopik.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language_id: 63, // JavaScript (Node.js)
        source_code: code,
        stdin: ""
      })
    });

    if (!judge0Response.ok) {
      return NextResponse.json(
        { error: `Judge0 API error: ${judge0Response.status}` },
        { status: 500 }
      );
    }

    const judge0Data = await judge0Response.json();

    // Format response similar to original format
    let output = "";
    let logs: string[] = [];

    if (judge0Data.stdout) {
      logs.push(judge0Data.stdout);
    }

    if (judge0Data.stderr) {
      logs.push(`ERROR: ${judge0Data.stderr}`);
    }

    if (judge0Data.compile_output) {
      logs.push(`COMPILE ERROR: ${judge0Data.compile_output}`);
    }

    return NextResponse.json({ 
      logs,
      result: judge0Data.status?.description || "Completed"
    });

  } catch (err: any) {
    // Handle errors
    const sanitizedError = err.message || "An error occurred during code execution";
    return NextResponse.json({ error: sanitizedError });
  }
}

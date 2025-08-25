import { NextResponse } from "next/server";

export const runtime = "nodejs";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Rate limiting simple implementation (in production, use proper rate limiting)
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
        { status: 429, headers: corsHeaders }
      );
    }

    // Parse and validate request
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400, headers: corsHeaders }
      );
    }

    const { code, language_id = 63, stdin = "" } = body;

    // Validate code
    const validationError = validateCode(code);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate language_id
    const supportedLanguages = [63, 71, 62, 54, 50, 78, 51, 60, 73]; // JS, Python, Java, C++, C, Kotlin, C#, Go, Rust
    if (!supportedLanguages.includes(language_id)) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Encode source code and stdin to base64 to handle UTF-8 characters
    const base64Code = Buffer.from(code, 'utf-8').toString('base64');
    
    // Ensure stdin ends with newline for proper input handling
    let processedStdin = stdin;
    if (stdin && !stdin.endsWith('\n')) {
      processedStdin = stdin + '\n';
    }
    const base64Stdin = processedStdin ? Buffer.from(processedStdin, 'utf-8').toString('base64') : "";
    
    // Submit to Judge0 API with base64 encoding
    const judge0Response = await fetch('https://api.vietopik.com/submissions?base64_encoded=true&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        language_id: language_id,
        source_code: base64Code,
        stdin: base64Stdin,
        expected_output: null
      })
    });

    if (!judge0Response.ok) {
      return NextResponse.json(
        { error: `Judge0 API error: ${judge0Response.status}` },
        { status: 500, headers: corsHeaders }
      );
    }

    const judge0Data = await judge0Response.json();

    // Debug log to see what we sent and what Judge0 returns
    console.log("Sent to Judge0:", {
      language_id,
      source_code: code.substring(0, 100) + "...", // Only show first 100 chars
      original_stdin: stdin || "(empty)",
      processed_stdin: processedStdin || "(empty)",
      base64_stdin: base64Stdin || "(empty)"
    });
    console.log("Judge0 response:", JSON.stringify(judge0Data, null, 2));

    // Format response similar to original format
    let logs: string[] = [];

    // Decode base64 output if needed
    const decodeBase64 = (data: string) => {
      try {
        return Buffer.from(data, 'base64').toString('utf-8');
      } catch {
        return data; // Return original if not base64
      }
    };

    if (judge0Data.stdout && judge0Data.stdout.trim()) {
      const decodedStdout = decodeBase64(judge0Data.stdout.trim());
      logs.push(decodedStdout);
    }

    if (judge0Data.stderr && judge0Data.stderr.trim()) {
      const decodedStderr = decodeBase64(judge0Data.stderr.trim());
      logs.push(`ERROR: ${decodedStderr}`);
    }

    if (judge0Data.compile_output && judge0Data.compile_output.trim()) {
      const decodedCompileOutput = decodeBase64(judge0Data.compile_output.trim());
      logs.push(`COMPILE ERROR: ${decodedCompileOutput}`);
    }

    // If no output but execution was successful, show status
    if (logs.length === 0 && judge0Data.status?.id === 3) {
      logs.push("Program executed successfully (no output)");
    }

    // Add debug info if no logs were produced
    if (logs.length === 0) {
      logs.push(`[DEBUG] Status: ${judge0Data.status?.description || 'Unknown'}`);
      logs.push(`[DEBUG] Status ID: ${judge0Data.status?.id || 'Unknown'}`);
      if (judge0Data.stdout === null) {
        logs.push(`[DEBUG] stdout is null - program may not have produced output`);
      }
      if (judge0Data.stderr === null) {
        logs.push(`[DEBUG] stderr is null - no errors detected`);
      }
    }

    return NextResponse.json({ 
      logs,
      result: judge0Data.status?.description || "Completed",
      // Include raw data for debugging
      debug: {
        status: judge0Data.status,
        stdout: judge0Data.stdout,
        stderr: judge0Data.stderr,
        compile_output: judge0Data.compile_output
      }
    }, { headers: corsHeaders });

  } catch (err: any) {
    // Handle errors
    const sanitizedError = err.message || "An error occurred during code execution";
    return NextResponse.json({ error: sanitizedError }, { headers: corsHeaders });
  }
}

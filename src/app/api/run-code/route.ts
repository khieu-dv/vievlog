import { NextResponse } from "next/server";
import { createContext, runInContext } from "vm";
import { inspect } from "util";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const logs: string[] = [];

    const sandbox = {
      console: {
        log: (...args: any[]) => {
          logs.push(args.map((arg) => inspect(arg, { depth: null })).join(" "));
        },
        error: (...args: any[]) => {
          logs.push(`ERROR: ${args.map((arg) => inspect(arg, { depth: null })).join(" ")}`);
        },
        warn: (...args: any[]) => {
          logs.push(`WARN: ${args.map((arg) => inspect(arg, { depth: null })).join(" ")}`);
        },
      },
    };
    createContext(sandbox);

    const result = runInContext(code, sandbox, { timeout: 1000 });

    return NextResponse.json({ logs, result: inspect(result, { depth: null }) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

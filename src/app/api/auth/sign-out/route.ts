// app/api/auth/sign-out/route.ts
import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.vietopik.com");

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 400 });
    }

    const token = authHeader.replace("Bearer ", "");

    pb.authStore.save(token, null);

    // Xác thực token bằng cách gọi authRefresh (nếu token không hợp lệ sẽ throw)
    await pb.collection("users").authRefresh();

    // Xóa session
    pb.authStore.clear();

    return NextResponse.json({ message: "Signed out successfully" }, { status: 200 });
  } catch (error) {
    console.error("Logout failed:", error);
    return NextResponse.json({ error: "Invalid token or sign-out failed" }, { status: 400 });
  }
}

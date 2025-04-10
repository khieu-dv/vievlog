// pages/api/auth/sign-out.ts
import type { NextApiRequest, NextApiResponse } from "next";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.vietopik.com");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");

    // Thử xác thực token
    pb.authStore.save(token, null); // Gán token để xác thực người dùng hiện tại
    await pb.collection("users_tbl").authRefresh(); // Kiểm tra token có hợp lệ không

    pb.authStore.clear(); // Xóa session khỏi PocketBase client

    return res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Logout failed:", error);
    return res.status(400).json({ error: "Invalid token or sign-out failed" });
  }
}

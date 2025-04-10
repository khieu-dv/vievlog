// ~/lib/auth-client.ts
import PocketBase from "pocketbase";
import { useState, useEffect, useCallback } from "react";

const pb = new PocketBase("https://pocketbase.vietopik.com");

// Đăng ký tài khoản
export async function signUp({
  username,
  email,
  password,
  passwordConfirm,
}: {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) {
  return await pb.collection("users").create({
    username,
    email,
    password,
    passwordConfirm,
  });
}

// Đăng nhập
export async function signIn(email: string, password: string) {
  return await pb.collection("users").authWithPassword(email, password);
}

// Lấy thông tin người dùng từ PocketBase authStore
const fetchUser = async () => {
  if (!pb.authStore.isValid) return null;

  try {
    const user = pb.authStore.model;
    return { user };
  } catch (err) {
    return null;
  }
};

// Hook useSession
export function useSession() {
  const [session, setSession] = useState<{ user: any } | null>(null);
  const [isPending, setIsPending] = useState(true);

  const refetch = useCallback(async () => {
    setIsPending(true);
    const data = await fetchUser();
    setSession(data);
    setIsPending(false);
  }, []);

  useEffect(() => {
    refetch();

    // Lắng nghe khi token (auth) thay đổi từ localStorage
    const onStorage = (e: StorageEvent) => {
      if (e.key === "pocketbase_auth") {
        refetch();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refetch]);

  return {
    data: session,
    isPending,
    refetch,
  };
}

// Đăng xuất
// ~/lib/auth-client.ts
export async function signOut(token?: string) {
  try {
    if (!token) {
      const stored = localStorage.getItem("pocketbase_auth");
      token = stored ? JSON.parse(stored).token : undefined;
    }

    if (!token) throw new Error("No token found");

    await fetch("/api/auth/sign-out", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Xóa localStorage
    localStorage.removeItem("pocketbase_auth");

    // Redirect nếu cần
    window.location.href = "/auth/sign-in";
  } catch (err) {
    console.error("Error signing out:", err);
  }
}

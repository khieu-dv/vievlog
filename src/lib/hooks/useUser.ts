// ~/hooks/useUser.ts
import { useState, useEffect } from "react";
import { useSession } from "../auth-client_v2";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  created?: string;
}

export function useUser() {
  const { data, isPending, refetch } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (data?.user) {
        // Map PocketBase user model to our User interface
        setUser({
          id: data.user.id,
          name: data.user.name || data.user.email.split('@')[0],
          email: data.user.email,
          //avatar: data.user.image ? `https://pocketbase.vietopik.com/api/files/${data.user.collectionId}/${data.user.id}/${data.user.image}` : undefined,
          role: 'user', // Default role assigned as 'user'
          //created: data.user.createdAt
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [data, isPending]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    refetchUser: refetch
  };
}
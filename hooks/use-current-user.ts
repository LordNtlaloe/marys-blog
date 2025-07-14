// hooks/use-current-user.ts
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "next-auth";
import { getUserById } from "@/actions/user.actions";

interface ExtendedUser extends User {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  image?: string;
  role: "User" | "Admin"
}

export const useCurrentUser = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        if (status === "authenticated" && session?.user?.id) {
          const currentUser = await getUserById(session.user.id);
          setUser(currentUser);
        } else if (status === "unauthenticated") {
          setUser(null);
        }
      } catch (err) {
        setError("Failed to load user data");
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [status, session]);

  return { user, loading, error };
};

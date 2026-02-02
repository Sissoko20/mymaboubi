"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("currentUser");
      const isPublicPage = pathname === "/login" || pathname === "/signup";

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        if (isPublicPage) router.push("/"); // Redirige vers l'accueil si déjà connecté
      } else {
        setUser(null);
        if (!isPublicPage) router.push("/login"); // Force la connexion
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading ? children : (
        <div className="h-screen w-full flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
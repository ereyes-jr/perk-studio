"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { refresh } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        await refresh();
        window.location.href = "/";
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 group"
    >
      {isLoggingOut ? (
        <div className="w-4 h-4 border-2 border-red-600 dark:border-red-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <LogOut className="h-4 w-4 !text-red-600 dark:!text-red-500" />
      )}
      <span className="text-sm font-medium !text-red-600 dark:!text-red-500">
        {isLoggingOut ? "Signing out..." : "Log Out"}
      </span>
    </button>
  );
}
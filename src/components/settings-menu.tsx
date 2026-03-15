"use client";

import { Menu, LogIn, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function SettingsMenu() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Delay closing to allow moving between button and dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Menu Button */}
      <button
        className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Open settings menu"
      >
        <Menu className="h-5 w-5 text-black dark:text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 w-48 z-50 overflow-hidden">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              handleMenuItemClick();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left border-b border-zinc-200 dark:border-zinc-700"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-700" />
            )}
            <span className="text-sm text-black dark:text-white font-medium">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          {/* Login Button or User Info */}
          {isAuthenticated && user ? (
            <>
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Logged in as</p>
                <p className="text-sm font-medium text-black dark:text-white truncate">
                  {user.email}
                </p>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  handleMenuItemClick();
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left text-red-600 dark:text-red-500"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={handleMenuItemClick}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left block"
            >
              <LogIn className="h-4 w-4 text-black dark:text-white" />
              <span className="text-sm text-black dark:text-white font-medium">Log In</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
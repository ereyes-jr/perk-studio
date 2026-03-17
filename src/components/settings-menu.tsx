"use client";

import { Menu, LogIn, Moon, Sun, ImagePlus } from "lucide-react"; 
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { LogoutButton } from "./logout-button";
import { LoginModal } from "../app/@modal/LoginModal";
import { UploadModal } from "../app/@modal/UploadModal";
import Link from "next/link"; 

export function SettingsMenu() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Open settings menu"
      >
        <Menu className="h-5 w-5 text-black dark:text-white" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-56 z-50 overflow-hidden">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              handleMenuItemClick();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left border-b border-zinc-200 dark:border-zinc-800"
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

          {isAuthenticated && user ? (
            <>
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500 mb-1">
                  Admin
                </p>
                <p className="text-sm font-medium text-black dark:text-white truncate">
                  {user.email}
                </p>
              </div>

              {/* Upload Action */}
                <button
                  onClick={() => {
                    setIsUploadModalOpen(true);
                    handleMenuItemClick();
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left border-b border-zinc-200 dark:border-zinc-800"
                >
                  <ImagePlus className="h-4 w-4 text-black dark:text-white" />
                  <span className="text-sm text-black dark:text-white font-medium">Upload Photo</span>
                </button>
              
              <LogoutButton />
            </>
          ) : (
            <button
              onClick={() => {
                setIsLoginModalOpen(true);
                handleMenuItemClick();
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
            >
              <LogIn className="h-4 w-4 text-black dark:text-white" />
              <span className="text-sm text-black dark:text-white font-medium">Log In</span>
            </button>
          )}
        </div>
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      <UploadModal 
      isOpen={isUploadModalOpen} 
      onClose={() => setIsUploadModalOpen(false)} />
    </div>
  );
}
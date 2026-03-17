"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Hanko } from "@teamhanko/hanko-elements";

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (val: boolean) => void;
  isSaving: boolean;
  setIsSaving: (val: boolean) => void;
  saveTrigger: number;
  triggerSave: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || "";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTrigger, setSaveTrigger] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const hasCookie = document.cookie.split(';').some((item) => item.trim().startsWith('hanko='));
      
      if (!hasCookie) {
        setIsAdmin(false);
        return;
      }

      try {
        const hanko = new Hanko(hankoApi);
        const user = await (hanko as any).getCurrent();
        setIsAdmin(!!user);
      } catch (err) {
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  const triggerSave = () => setSaveTrigger((prev) => prev + 1);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isEditMode,
        setIsEditMode,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        isSaving,
        setIsSaving,
        saveTrigger,
        triggerSave,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
};
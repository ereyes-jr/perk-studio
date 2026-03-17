"use client";

import { createContext, useContext, useState } from "react";

interface AdminContextType {
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

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTrigger, setSaveTrigger] = useState(0);

  const triggerSave = () => setSaveTrigger((prev) => prev + 1);

  return (
    <AdminContext.Provider
      value={{
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
"use client";

import { useEffect, useState } from "react";
import { SettingsMenu } from "./settings-menu";
import { useAdmin } from "@/context/AdminContext";
import { Save, Loader2, Settings } from "lucide-react";
import { Hanko } from "@teamhanko/hanko-elements";

function Header() {
  const { isEditMode, setIsEditMode, hasUnsavedChanges, isSaving, triggerSave } = useAdmin();
  const [isAdmin, setIsAdmin] = useState(false);
  const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || "";

  useEffect(() => {
    const hanko = new Hanko(hankoApi) as any;
    hanko.user.getCurrent().then((user: any) => setIsAdmin(!!user)).catch(() => setIsAdmin(false));
    
    const subCreated = hanko.onSessionCreated(() => setIsAdmin(true));
    const subExpired = hanko.onSessionExpired(() => setIsAdmin(false));
    return () => { subCreated(); subExpired(); };
  }, [hankoApi]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        if (isAdmin && isEditMode && hasUnsavedChanges && !isSaving) {
          e.preventDefault(); 
          triggerSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, isEditMode, hasUnsavedChanges, isSaving, triggerSave]);

  return (
    <div className="flex justify-between items-end mb-12">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tighter text-black dark:text-white"> Perk Studio</h1>
        <p className="text-zinc-500 mt-2 text-lg">High Quality photos taken by Perk Studio</p>
      </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <>
            {isEditMode && hasUnsavedChanges && (
              <button
                  onClick={triggerSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md"
                >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    Save Changes <span className="ml-2 opacity-50 text-[10px] hidden md:inline">⌘S</span>
              </button>
            )}
            
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`p-2 rounded-xl transition-all ${
                isEditMode 
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-inner" 
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              <Settings className={`h-5 w-5 ${isEditMode ? "animate-spin [animation-duration:3s]" : ""}`} />
            </button>
          </>
        )}

        <SettingsMenu />
      </div>
    </div>
  );
}

export default Header;
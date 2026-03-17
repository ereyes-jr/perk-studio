"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { register } from "@teamhanko/hanko-elements";
import { useAuth } from "@/lib/auth-context";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL ?? "";

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { refresh } = useAuth();
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (isOpen) {
      register(hankoApi).catch(() => {});
      
      const hankoLoginElement = document.getElementById("hanko-login");
      
      const handleSuccess = async () => {
        await refresh();
        onClose(); // Close modal on success
      };

      const handleAuthError = () => setNonce((prev) => prev + 1);

      hankoLoginElement?.addEventListener("onSessionCreated", handleSuccess);
      hankoLoginElement?.addEventListener("onAuthFlowCompleted", handleSuccess);
      hankoLoginElement?.addEventListener("onAuthError", handleAuthError);

      return () => {
        hankoLoginElement?.removeEventListener("onSessionCreated", handleSuccess);
        hankoLoginElement?.removeEventListener("onAuthFlowCompleted", handleSuccess);
        hankoLoginElement?.removeEventListener("onAuthError", handleAuthError);
      };
    }
  }, [isOpen, refresh, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-8 relative shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-6 text-center">Admin Access</h1>
        
        <hanko-login id="hanko-login" key={nonce} />
        
         <style jsx global>{`
                    hanko-login::part(container) { background-color: transparent; }
                    hanko-login::part(input) {
                        background-color: #ffffff;
                        border: 1px solid #e4e4e7;
                        color: #09090b;
                        border-radius: 12px;
                    }
                    .dark hanko-login::part(input) {
                        background-color: #09090b;
                        border: 1px solid #27272a;
                        color: #ffffff;
                    }
                    hanko-login::part(button) {
                        background-color: #09090b;
                        color: #ffffff;
                        border-radius: 99px;
                        font-weight: 600;
                    }
                    .dark hanko-login::part(button) {
                        background-color: #ffffff;
                        color: #09090b;
                    }
                    hanko-login::part(divider-line) { border-top: 1px solid #e4e4e7; }
                    .dark hanko-login::part(divider-line) { border-top: 1px solid #27272a; }
                    hanko-login::part(divider-text) {
                        color: #71717a;
                        background-color: #ffffff;
                        padding: 0 12px;
                    }
                    .dark hanko-login::part(divider-text) {
                        background-color: #18181b;
                    }
                    hanko-login::part(heading) { color: #09090b; }
                    .dark hanko-login::part(heading) { color: #ffffff; }
                `}</style>
      </div>
    </div>
  );
}
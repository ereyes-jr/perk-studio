"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { register, Hanko } from "@teamhanko/hanko-elements";
import { useAuth } from "@/lib/auth-context";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL ?? "";

export default function LoginPage() {
    const router = useRouter();
    const { refresh } = useAuth();
    const [nonce, setNonce] = useState(0);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const hanko = new Hanko(hankoApi);
        
        const checkSession = () => {
            // We check for the 'hanko' cookie directly. 
            const hasSession = document.cookie.split("; ").some((row) => row.startsWith("hanko="));
            
            if (hasSession) {
                setIsRedirecting(true);
                router.replace("/");
            }
        };
        
        checkSession();
        register(hankoApi).catch(() => {});

        const hankoLoginElement = document.getElementById("hanko-login");

        const handleSuccess = async () => {
            setIsRedirecting(true);
            await refresh();
            router.replace("/");
        };

        const handleAuthError = () => {
            setIsRedirecting(false);
            setNonce((prev) => prev + 1);
        };

        hankoLoginElement?.addEventListener("onSessionCreated", handleSuccess);
        hankoLoginElement?.addEventListener("onAuthFlowCompleted", handleSuccess);
        hankoLoginElement?.addEventListener("onAuthError", handleAuthError);

        return () => {
            hankoLoginElement?.removeEventListener("onSessionCreated", handleSuccess);
            hankoLoginElement?.removeEventListener("onAuthFlowCompleted", handleSuccess);
            hankoLoginElement?.removeEventListener("onAuthError", handleAuthError);
        };
    }, [router, refresh]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 transition-colors duration-300">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-300 relative overflow-hidden">
                
                {isRedirecting && (
                    <div className="absolute inset-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                        <div className="w-6 h-6 border-2 border-zinc-500 border-t-zinc-950 dark:border-t-white rounded-full animate-spin mb-4" />
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">Authorizing Admin...</p>
                    </div>
                )}

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
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { register } from "@teamhanko/hanko-elements";
import { useAuth } from "@/lib/auth-context";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL ?? "";

export default function LoginPage() {
    const router = useRouter();
    const { refresh } = useAuth();

    useEffect(() => {
        // Register Hanko Web Components
        register(hankoApi).catch(() => {});

        const hankoAuthElement = document.getElementById("hanko-auth");

        const handleSessionCreated = async () => {
            // Update global state immediately
            await refresh();
            // Move the user to the dashboard/home
            router.replace("/");
        };

        // Listen for the successful login event from the custom element
        hankoAuthElement?.addEventListener("onSessionCreated", handleSessionCreated);

        return () => {
            hankoAuthElement?.removeEventListener("onSessionCreated", handleSessionCreated);
        };
    }, [router, refresh]);

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h1>

                <hanko-auth id="hanko-auth" />

                <style jsx global>{`
                    hanko-auth::part(container) {
                        background-color: transparent;
                    }
                    hanko-auth::part(button) {
                        background-color: white;
                        color: black;
                        border-radius: 99px;
                    }
                `}</style>
            </div>
        </div>
    );
}
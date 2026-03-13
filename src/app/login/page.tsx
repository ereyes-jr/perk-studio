"use client"

import { useEffect, useCallback, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { register } from "@teamhanko/hanko-elements";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL ?? "";

export default function LoginPage() {
    const router = useRouter();
    const [hankoElement, setHankoElement] = useState<any>(null);

    //redirect after a successful login
    const redirectAfterLogin = useCallback(() => {
        router.replace("/");
        router.refresh();
    }, [router]);

    useEffect(() => {
        register(hankoApi).catch((err) => console.error(err));
}, []);

    useEffect(() => {
        const container = document.getElementById("hanko-auth");
        container?.addEventListener("onAuthFlowCompleted", redirectAfterLogin);

        return () => {
            container?.removeEventListener("onAuthFlowCompleted", redirectAfterLogin);
        };
    }, [redirectAfterLogin]);
        
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h1>

                <hanko-auth id="hanko-auth"/>

                <style jsx global>{`
                hanko-auth::part(container){
                    background-color: transparent;
                }
                hanko-auth::part(button){
                    background-color: white;
                    color:black;
                    border-radius: 99px;
                }
            `}</style>
            </div>
        </div>
    );
} 

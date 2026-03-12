"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    
    
    const onDismiss = useCallback(() => {
        router.back();
    }, [router]);
    
    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, [router]);

const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
        onDismiss();
    }
};
    
    return (
        <dialog
            ref={dialogRef}
            onClose={onDismiss}
            onClick={handleBackdropClick}
            className="m-0 h-full w-full max-w-none bg-black/80 backdrop:bg-transparent p-0 flex items-center justify-center border-none outline-none"
        >
        
        <div className="relative max-w-4xl w-[90%] md:w-full bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        

        <button
            onClick={onDismiss}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all border border-white/10"
            aria-label="Close modal"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="w-full h-full">
            {children}
        </div>
        </div>
        </dialog>
    );
}
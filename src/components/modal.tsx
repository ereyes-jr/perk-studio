"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        // Force close any previous state
        if (dialog.open) {
            dialog.close();
        }

        // Small delay ensures the DOM has settled before opening
        const openTimeout = setTimeout(() => {
            try {
                dialog.showModal();
                setIsOpen(true);
            } catch (e) {
                console.warn("Could not open modal:", e);
            }
        }, 0);

        return () => {
            clearTimeout(openTimeout);
            if (dialog?.open) {
                dialog.close();
            }
        };
    }, [children]); 

    const onDismiss = () => {
        const dialog = dialogRef.current;
        if (dialog?.open) {
            dialog.close();
        }
        setIsOpen(false);
        router.back();
    };

    return (
        <dialog
            ref={dialogRef}
            onClose={onDismiss}
            onClick={(e) => {
                if (e.target === dialogRef.current) onDismiss();
            }}
            className="m-0 h-full w-full max-w-none bg-black/80 backdrop:bg-transparent p-0 flex items-center justify-center border-none outline-none"
        >
            <div 
                className="relative max-w-4xl w-[90%] md:w-full bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onDismiss}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all border border-white/10"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                {children}
            </div>
        </dialog>
    );
}
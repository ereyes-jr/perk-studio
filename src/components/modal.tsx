"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const onDismiss = () => {
    // router.back() triggers the unmount of the intercepted route
    router.back();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onDismiss}
      onClick={(e) => {
        // Backdrop click detection
        if (e.target === dialogRef.current) onDismiss();
      }}
      className="fixed inset-0 z-[100] m-0 flex h-full w-full max-w-none items-center justify-center border-none bg-black/90 p-0 outline-none backdrop:bg-transparent"
    >
      <div
        className="relative max-w-5xl w-[95%] md:w-full bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onDismiss}
          className="absolute top-6 right-6 z-20 p-2.5 bg-black/40 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {children}
      </div>
    </dialog>
  );
}
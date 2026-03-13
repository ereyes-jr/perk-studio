import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function UploadPage() {
    const cookieStore = await cookies();
    const hankoCookie = cookieStore.get("hanko");

    // If hanko cookie doesn't exist, redirect to login page
    if (!hankoCookie) {
       redirect("/login");
    }

    return (
        <main className="min-h-screen bg-zinc-950 p-12 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <Link href="/" className="text-zinc-500 hover:text-white mb-8 block transition-colors">
          &larr; Back to Gallery
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-2">Upload</h1>
        <p className="text-zinc-500 mb-12">Add new photos taken</p>

        {/* This is where we will build the dropzone later */}
        <div className="w-full aspect-video border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group">
           <div className="p-4 rounded-full bg-zinc-800 text-zinc-400 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
           </div>
           <p className="mt-4 text-zinc-400 font-medium">Click or drag to upload</p>
           <p className="text-zinc-600 text-sm mt-1">RAW, JPEG, or PNG up to 20MB</p>
        </div>
      </div>
    </main>
    );
}
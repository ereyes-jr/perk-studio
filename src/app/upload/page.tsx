import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UploadDropzone } from "@/components/upload-dropzone";

export default async function UploadPage() {
    const cookieStore = await cookies();
    const hankoCookie = cookieStore.get("hanko");

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
            <p className="text-zinc-500 mb-12">Add new photos to your portfolio</p>

            <UploadDropzone />
          </div>
        </main>
    );
}
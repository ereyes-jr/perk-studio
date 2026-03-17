import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function PhotoView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: photo, error } = await supabase
    .from("photos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !photo) {
    return (
      <div className="text-white text-center py-20">
        <h1 className="text-2xl font-bold">Photo not found</h1>
        <Link href="/" className="text-zinc-400 hover:text-white underline mt-4 block">
          Return to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full animate-in fade-in duration-700">
      <div className="relative aspect-[3/2] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <Image
          src={photo.image_url}
          alt={photo.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Info Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-zinc-900 dark:text-white text-5xl font-bold tracking-tight">
            {photo.title}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xl mt-4">
            Captured using the {photo.make} {photo.model}. 
          </p>
        </div>

        {/* Technical Specs Sidebar */}
        <div className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 h-fit">
          <h3 className="text-zinc-900 dark:text-white font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Technical Specs
          </h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <span className="text-zinc-500 text-sm uppercase tracking-widest font-semibold">Aperture</span>
              <span className="text-zinc-900 dark:text-white font-medium">{photo.aperture || "N/A"}</span>
            </div>
            <div className="flex justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <span className="text-zinc-500 text-sm uppercase tracking-widest font-semibold">Shutter</span>
              <span className="text-zinc-900 dark:text-white font-medium">{photo.shutter_speed || "N/A"}</span>
            </div>
            <div className="flex justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <span className="text-zinc-500 text-sm uppercase tracking-widest font-semibold">ISO</span>
              <span className="text-zinc-900 dark:text-white font-medium">{photo.iso || "N/A"}</span>
            </div>
            <div className="flex justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <span className="text-zinc-500 text-sm uppercase tracking-widest font-semibold">Focal Length</span>
              <span className="text-zinc-900 dark:text-white font-medium">{photo.focal_length || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen w-full p-8 md:p-12 flex flex-col items-center bg-white dark:bg-zinc-950 transition-colors">
      <Link
        href="/"
        className="self-start text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-12 flex items-center gap-2 transition-colors font-medium"
      >
        &larr; Back to Gallery
      </Link>
      
      <Suspense
        fallback={
          <div className="max-w-6xl w-full aspect-[3/2] rounded-3xl bg-zinc-200 dark:bg-zinc-900 animate-pulse" />
        }
      >
        <PhotoView params={params} />
      </Suspense>
    </div>
  );
}
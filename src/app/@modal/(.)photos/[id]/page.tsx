import Image from "next/image";
import { Modal } from "@/components/modal";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";

async function PhotoContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: photo, error } = await supabase
    .from("photos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !photo) {
    return (
      <div className="p-12 text-white bg-zinc-900 rounded-2xl">
        <p>Photo not found or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 max-w-5xl w-full mx-auto">
      {/* Image Container */}
      <div className="relative w-full h-[70vh] bg-black">
        <Image
          src={photo.image_url}
          alt={photo.title || "Gallery Image"}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Metadata Bar */}
      <div className="p-6 bg-zinc-900 border-t border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">
              {photo.title}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {photo.make} {photo.model}
            </p>
          </div>

          <div className="flex gap-6 border-l border-zinc-800 pl-6">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Aperture</p>
              <p className="text-sm text-zinc-200">{photo.aperture || "—"}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Shutter</p>
              <p className="text-sm text-zinc-200">{photo.shutter_speed || "—"}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">ISO</p>
              <p className="text-sm text-zinc-200">{photo.iso || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PhotoModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Modal>
      <Suspense
        fallback={
          <div className="h-[60vh] w-[80vw] flex items-center justify-center bg-zinc-900 rounded-2xl animate-pulse">
            <span className="text-zinc-500 font-medium">Loading Detail...</span>
          </div>
        }
      >
        <PhotoContent params={params} />
      </Suspense>
    </Modal>
  );
}
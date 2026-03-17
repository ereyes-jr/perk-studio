"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import exifr from "exifr";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";

export function UploadDropzone() {
    const [statue, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setStatus("uploading");

            const metadata = await exifr.parse(file);

            const fileExt = file.name.split(".").pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const { data : storageData, error: storageError } = await supabase.storage
                .from('photos')
                .upload(fileName, file);

            if (storageError) throw storageError;

            const { data: { publicUrl } } = supabase.storage
                .from('photos')
                .getPublicUrl(fileName);

            const { error: dbError } = await supabase.from('photos').insert({
                image_url: publicUrl,
                title: file.name.replace(/\.[^/.]+$/, ""),
                make: metadata?.Make,
                model: metadata?.Model,
                apertaure: metadata?.FNumber ? `f/${metadata.FNumber}` : null,
                shutter_speed: metadata?.ExposureTime ? `f/${Math.round(1/metadata.ExposureTime)}s` : null,
                iso: metadata?.ISO,
            });

            if (dbError) throw dbError;
            setStatus("success");

        } catch (error) {
            console.error("Upload failed:", error);
            setStatus("error");
        }
    };

    return (
    <label className="w-full aspect-video border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group relative overflow-hidden">
      <input type="file" className="hidden" onChange={handleFile} accept="image/*" disabled={status === "uploading"} />
      
      {status === "uploading" ? (
        <>
          <Loader2 className="h-10 w-10 text-white animate-spin mb-4" />
          <p className="text-white font-medium">Processing & Uploading...</p>
        </>
      ) : status === "success" ? (
        <>
          <CheckCircle2 className="h-10 w-10 text-green-500 mb-4" />
          <p className="text-white font-medium">Uploaded Successfully!</p>
          <button onClick={() => setStatus("idle")} className="mt-2 text-zinc-500 text-sm underline">Upload another</button>
        </>
      ) : (
        <>
          <div className="p-4 rounded-full bg-zinc-800 text-zinc-400 group-hover:scale-110 transition-transform">
            <Upload className="h-6 w-6" />
          </div>
          <p className="mt-4 text-zinc-400 font-medium">Click to upload photo</p>
          <p className="text-zinc-600 text-sm mt-1">EXIF data will be extracted automatically</p>
        </>
      )}
    </label>
  );
}
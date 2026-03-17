"use client";

import { X, Loader2, CheckCircle2, FileStack, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import exifr from "exifr";
import Image from "next/image";

interface PendingUpload {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  caption: string;
  make: string;
  model: string;
  aperture: string;
  shutter_speed: string;
  iso: string;
  focal_length: string;
}

export function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "editing" | "uploading" | "success" | "error">("idle");
  const [pendingFiles, setPendingFiles] = useState<PendingUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const resetModal = () => {
    pendingFiles.forEach(item => URL.revokeObjectURL(item.previewUrl));
    setPendingFiles([]);
    setStatus("idle");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleFileSelection = async (files: FileList | File[]) => {
    const newPending: PendingUpload[] = [];
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    
    for (const file of Array.from(files)) {
      if (!supportedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported format. Please use JPEG, PNG, or WebP.`);
        continue;
      }

      const metadata = await exifr.parse(file);
      
      newPending.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ""),
        caption: "",
        make: metadata?.Make || "",
        model: metadata?.Model || "",
        aperture: metadata?.FNumber ? `f/${metadata.FNumber}` : "",
        shutter_speed: metadata?.ExposureTime ? `1/${Math.round(1/metadata.ExposureTime)}` : "",
        iso: metadata?.ISO?.toString() || "",
        focal_length: metadata?.FocalLength ? `${metadata.FocalLength}mm` : "",
      });
    }

    if (newPending.length > 0) {
      setPendingFiles(prev => [...prev, ...newPending]);
      setStatus("editing");
    }
  };

  const startUpload = async () => {
    setStatus("uploading");
    try {
      for (const item of pendingFiles) {
        const fileExt = item.file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: storageError } = await supabase.storage
          .from('photos')
          .upload(fileName, item.file);

        if (storageError) throw storageError;

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(fileName);

        const isoNumber = item.iso === "" ? null : parseInt(item.iso, 10);

        const { error: dbError } = await supabase.from('photos').insert({
          image_url: publicUrl,
          title: item.title,
          caption: item.caption || null,
          make: item.make || null,
          model: item.model || null,
          aperture: item.aperture || null,
          shutter_speed: item.shutter_speed || null,
          iso: isNaN(isoNumber as number) ? null : isoNumber,
          focal_length: item.focal_length || null,
        });

        if (dbError) throw dbError;
      }
      
      router.refresh(); // Refresh gallery data in the background
      setStatus("success");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const updateMetadata = (id: string, field: keyof PendingUpload, value: string) => {
    setPendingFiles(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeFile = (id: string) => {
    setPendingFiles(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (filtered.length === 0) setStatus("idle");
      return filtered;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800">
        
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            {status === 'editing' ? `Review & Annotate (${pendingFiles.length})` : 'Upload Photos'}
          </h2>
          <button onClick={handleClose} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {status === "idle" && (
            <label 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelection(e.dataTransfer.files); }}
              className={`w-full aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer 
              ${isDragging ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-900 dark:border-white' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950/50'}`}
            >
              <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileSelection(e.target.files)} accept="image/*" multiple />
              <FileStack className="h-10 w-10 text-zinc-400 mb-4" />
              <p className="text-zinc-900 dark:text-white font-medium">Click or drag photos to start</p>
            </label>
          )}

          {status === "editing" && (
            <div className="space-y-10">
              {pendingFiles.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-8 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 relative group">
                  <button 
                    onClick={() => removeFile(item.id)}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="relative w-full md:w-56 aspect-[4/5] rounded-xl overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-800">
                    <Image src={item.previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 block">Title</label>
                      <input value={item.title} onChange={(e) => updateMetadata(item.id, 'title', e.target.value)} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none dark:text-white" />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 block">Caption / Story</label>
                      <textarea 
                        rows={2}
                        placeholder="Add a description or technical note..."
                        value={item.caption} 
                        onChange={(e) => updateMetadata(item.id, 'caption', e.target.value)} 
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none dark:text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1 block">ISO</label>
                        <input type="number" value={item.iso} onChange={(e) => updateMetadata(item.id, 'iso', e.target.value)} className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-1 text-xs dark:text-white outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1 block">Aperture</label>
                        <input value={item.aperture} onChange={(e) => updateMetadata(item.id, 'aperture', e.target.value)} className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-1 text-xs dark:text-white outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === "uploading" && (
            <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-zinc-900 dark:text-white mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">Publishing to your gallery...</p>
            </div>
          )}

          {status === "success" && (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-xl font-bold dark:text-white">Photos Published Successfully</p>
              <div className="flex gap-3 mt-6">
                <button onClick={resetModal} className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full font-medium transition-colors">Upload More</button>
                <button onClick={handleClose} className="px-8 py-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-full font-bold">Close</button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <X className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-xl font-bold dark:text-white">Something went wrong</p>
              <button onClick={() => setStatus("editing")} className="mt-6 px-8 py-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-full font-bold">Back to Editor</button>
            </div>
          )}
        </div>

        {status === "editing" && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <button onClick={resetModal} className="text-sm font-medium text-zinc-500 hover:text-zinc-900">Discard all</button>
            <button onClick={startUpload} className="px-10 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold flex items-center gap-2 hover:scale-[1.02] transition-all">
              <Save className="h-4 w-4" />
              Finish Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
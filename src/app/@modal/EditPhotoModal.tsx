"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface EditModalProps {
  photo: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedPhoto: any) => void;
}

export function EditPhotoModal({ photo, isOpen, onClose, onUpdate }: EditModalProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<any>(photo || {});

  useEffect(() => {
    if (photo) {
      setFormData(photo);
    }
  }, [photo]);

  // Early return if the modal shouldn't be visible
  if (!isOpen || !photo) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("photos")
        .update({
          title: formData.title,
          caption: formData.caption,
          make: formData.make,
          model: formData.model,
          aperture: formData.aperture,
          shutter_speed: formData.shutter_speed,
          iso: formData.iso === "" ? null : parseInt(formData.iso, 10),
          focal_length: formData.focal_length,
        })
        .eq("id", photo.id)
        .select()
        .single();

      if (error) throw error;
      onUpdate(data);
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-lg font-bold dark:text-white">Edit Photo Details</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 block">Title</label>
            <input 
              value={formData?.title || ""} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-zinc-400"
              placeholder="Photo Title"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 block">Caption</label>
            <textarea 
              rows={3}
              value={formData?.caption || ""} 
              onChange={(e) => setFormData({...formData, caption: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm dark:text-white outline-none resize-none focus:ring-1 focus:ring-zinc-400"
              placeholder="Describe this moment..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 block">Camera Make</label>
              <input 
                value={formData?.make || ""} 
                onChange={(e) => setFormData({...formData, make: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm dark:text-white outline-none"
                placeholder="e.g., Sony"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 block">Camera Model</label>
              <input 
                value={formData?.model || ""} 
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm dark:text-white outline-none"
                placeholder="e.g., A7IV"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 block">ISO</label>
              <input 
                type="number"
                value={formData?.iso || ""} 
                onChange={(e) => setFormData({...formData, iso: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 block">Aperture</label>
              <input 
                value={formData?.aperture || ""} 
                onChange={(e) => setFormData({...formData, aperture: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm dark:text-white outline-none"
                placeholder="f/2.8"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 shadow-lg"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Pencil, Trash2, Loader2, X, Save, GripVertical } from "lucide-react";
import { Hanko } from "@teamhanko/hanko-elements";
import { useAdmin } from "@/context/AdminContext";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Sub-Component: Individual Sortable Photo Card ---
function SortablePhoto({ photo, isEditMode, isAdmin, onEdit, onDelete }: any) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(photo.id, photo.image_url);
    setIsDeleting(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-shadow hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image 
          src={photo.image_url} 
          alt={photo.title || ""} 
          fill 
          className="object-cover transition-all duration-700 group-hover:scale-105" 
        />
        
        {/* The Intercepting Link Fix */}
        {!isEditMode && (
          <Link 
            href={`/photos/${photo.id}`} 
            className="absolute inset-0 z-10"
            scroll={false} 
            prefetch={false}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
              <p className="text-xl font-bold text-white mb-1">{photo.title}</p>
              <p className="text-xs text-zinc-400 line-clamp-1 italic mb-3">{photo.caption}</p>
              <div className="flex gap-3 text-[10px] text-zinc-300 font-black tracking-widest uppercase border-t border-white/10 pt-3">
                <span>{photo.model}</span>
                <span>{photo.aperture}</span>
                <span>ISO {photo.iso}</span>
              </div>
            </div>
          </Link>
        )}
      </div>

      {isAdmin && isEditMode && (
        <div className="flex items-center justify-between gap-2 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div {...attributes} {...listeners} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl cursor-grab active:cursor-grabbing hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <GripVertical className="h-5 w-5 dark:text-zinc-300" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(photo)} className="px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="p-3 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900 transition-colors disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-Component: Edit Metadata Modal ---
function EditPhotoModal({ photo, isOpen, onClose, onUpdate }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(photo || {});
  
  useEffect(() => { if (photo) setFormData(photo); }, [photo]);
  if (!isOpen || !photo) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("photos")
        .update({
          title: formData.title,
          caption: formData.caption,
          iso: formData.iso === "" ? null : parseInt(formData.iso, 10),
          aperture: formData.aperture,
        })
        .eq("id", photo.id)
        .select()
        .single();
      
      if (error) throw error;
      onUpdate(data);
      onClose();
    } catch (err: any) { 
      alert("Update failed: " + err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-lg font-bold dark:text-white">Edit Photo Details</h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <input value={formData?.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm dark:text-white outline-none" placeholder="Title" />
          <textarea rows={3} value={formData?.caption || ""} onChange={(e) => setFormData({...formData, caption: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm dark:text-white outline-none resize-none" placeholder="Caption" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" value={formData?.iso || ""} onChange={(e) => setFormData({...formData, iso: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm dark:text-white outline-none" placeholder="ISO" />
            <input value={formData?.aperture || ""} onChange={(e) => setFormData({...formData, aperture: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm dark:text-white outline-none" placeholder="Aperture" />
          </div>
        </div>
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button onClick={handleSave} disabled={loading} className="px-8 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Gallery Component ---
export default function Gallery() {
  const { isEditMode, setHasUnsavedChanges, setIsSaving, saveTrigger } = useAdmin();
  const [photos, setPhotos] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || "";
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    const hanko = new Hanko(hankoApi) as any;
    const initialize = async () => {
      try {
        const user = await hanko.user.getCurrent();
        setIsAdmin(!!user);
        const { data } = await supabase.from('photos').select('*').order('display_order', { ascending: true });
        setPhotos(data || []);
      } catch (err) {
        const { data } = await supabase.from('photos').select('*').order('display_order', { ascending: true });
        setPhotos(data || []);
      } finally { setLoading(false); }
    };
    initialize();
  }, [hankoApi]);

  useEffect(() => {
    if (saveTrigger > 0) saveOrder();
  }, [saveTrigger]);

  const saveOrder = async () => {
    setIsSaving(true);
    try {
      const updates = photos.map((p) => 
        supabase.from("photos").update({ display_order: p.display_order }).eq("id", p.id)
      );
      await Promise.all(updates);
      setHasUnsavedChanges(false);
    } catch (err) {
      alert("Save failed");
    } finally { setIsSaving(false); }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = photos.findIndex((p) => p.id === active.id);
    const newIndex = photos.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(photos, oldIndex, newIndex).map((p, i) => ({ ...p, display_order: i }));
    setPhotos(reordered);
    setHasUnsavedChanges(true);
  };

  const deletePhoto = async (id: string, imageUrl: string) => {
    if (!isAdmin) {
        alert("Action restricted to admins.");
        return;
    }
    
    if (!confirm("Are you sure? This will remove the photo permanently.")) return;

    try {
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage.from("photos").remove([fileName]);
        if (storageError) console.warn("Storage deletion warning:", storageError.message);
      }

      const { error: dbError } = await supabase.from("photos").delete().eq("id", id);
      
      if (dbError) {
        throw new Error(`Database rejected deletion: ${dbError.message}. Check your RLS policies.`);
      }

      setPhotos(prev => prev.filter(p => p.id !== id));
      
    } catch (err: any) {
      console.error("Delete sequence failed:", err);
      alert(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-8">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo) => (
              <SortablePhoto 
                key={photo.id} 
                photo={photo} 
                isEditMode={isEditMode} 
                isAdmin={isAdmin} 
                onEdit={setEditingPhoto} 
                onDelete={deletePhoto} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <EditPhotoModal 
        photo={editingPhoto} 
        isOpen={!!editingPhoto} 
        onClose={() => setEditingPhoto(null)} 
        onUpdate={(updated: any) => setPhotos(prev => prev.map(p => p.id === updated.id ? updated : p))} 
      />
    </div>
  );
}
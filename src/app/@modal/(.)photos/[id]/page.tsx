import Image from "next/image";
import { Modal } from "@/components/modal";
import { Suspense } from "react";

async function PhotoContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const photo = {
        id,
        src: `https://picsum.photos/id/${parseInt(id) * 10}/1200/800`,
        title: `Photo ${id}`,
    };

    return (
        <div key={id} className="bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
            <div className="flex flex-col items-center gap-4 relative w-full h-96">
                <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <div className="p-6 bg-zinc-900">
                <h2 className="text-xl font-semibold text-white">{photo.title}</h2>
                <p className="text-zinc-400">ID: {photo.id}</p>
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
            <Suspense fallback={
                <div className="h-[500px] w-full flex items-center justify-center bg-zinc-900 rounded-2xl animate-pulse">
                    <span className="text-zinc-500">Loading Photo Detail...</span>
                </div>
            }>
                <PhotoContent params={params} />
            </Suspense>
        </Modal>
    );
}
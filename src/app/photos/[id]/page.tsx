import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

async function PhotoView({ params }: {params: Promise<{ id: string }> }) {
    const { id } = await params;

    const photoUrl = `https://picsum.photos/id/${parseInt(id) * 10}/1200/800`;

    return (
        <div className="max-w-5xl w-full">
            <div className="relative aspect-[3/2] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl">
                <Image
                    src={photoUrl}
                    alt={`Photo ${id}`}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <h1 className="text-white text-2xl mt-6 font-medium"> Photo Detail: {id}</h1>
        </div>
    );
}

export default function PhotoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <div className="w-full h-full p-8 flex flex-col items-center bg-black/90 backdrop-blur-xl">            <Link href="/" className="self-start text-zinc-400 hover:text-white mb-8 transition-colors">
            &larr; Back to Gallery
            </Link>
            <Suspense fallback={
                <div className="max-w-5xl w-full aspect-[3/2] rounded-3xl bg-zinc-900 animate-pulse flex items-center justify-center">
                    <span className="text-zinc-500">Loading...</span>
                </div>
            }>
                <PhotoView params={params} />
            </Suspense>
        </div>
    );
}
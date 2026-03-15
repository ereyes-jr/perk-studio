import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";

async function getPhotos() {
  "use cache";

  //for now this is manually defined, return to use db.photo.findMany()
  return [
    { id: "1", url: "https://picsum.photos/id/10/800/800" , title: "Photo 1" },
    { id: "2", url: "https://picsum.photos/id/20/800/800" , title: "Photo 2" },
    { id: "3", url: "https://picsum.photos/id/30/800/800" , title: "Photo 3" },
  ];
}

export default async function Home() {
  const photos = await getPhotos();

  return (
  <main className="min-h-screen p-12 bg-white dark:bg-zinc-950 transition-colors duration-500">
    <Header />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {photos.map((photo) => (
        <Link
          key={photo.id}
          href={`/@modal/photos/${photo.id}`}
          scroll={false}
          prefetch={false}
          className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          >
          <Image 
            src={photo.url}
            alt={photo.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw)"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
            <p className="text-xl font-semibold text-white">{photo.title}</p>
          </div>
        </Link>
      ))}
    </div>
  </main>
);
}
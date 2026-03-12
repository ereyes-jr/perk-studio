import Image from "next/image";
import Link from "next/link";

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
    <main className="min-h-screen p-12 bg-zinc-950">
      <div className="flex justify-between items-end bm-12">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tigher text-white"> Perk Studio</h1>
          <p className="text-zinc-500 mt-2 text-lg">High Quality photos taken by Perk Studio</p>
        </div>
        {/* This will be hidden behind auth later */}

        <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors">
          Upload
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((photo) => (
          <Link
            key={photo.id}
            href={`/photos/${photo.id}`}
            scroll={false}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800"
            >
            <Image 
            src={photo.url}
            alt={photo.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            sizes="(max-width:768px 100vw, (max-width:1200px) 50vw, 33vw)"
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
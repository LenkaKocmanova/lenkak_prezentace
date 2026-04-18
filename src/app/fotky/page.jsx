import connectDB from "@/config/database";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import Property from "../../../models/Property";

export const dynamic = "force-dynamic";

function normalizeImageSrc(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
}

export default async function FotkyPage() {
  await connectDB();

  let properties = [];
  try {
    properties = await Property.find().sort({ updatedAt: -1 }).lean();
  } catch (err) {
    console.error("Fotky: Property.find failed:", err.message);
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-neutral-900">
          Fotky
        </h1>

        {properties.length === 0 ? (
          <p className="rounded-lg border border-neutral-200 bg-white p-6 text-center text-neutral-600 shadow-sm">
            Zatím tu nejsou žádné položky. Přidejte záznamy do databáze (Property),
            pak se tu zobrazí náhledy a odkazy na detail.
          </p>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => {
              const id = String(p._id);
              const img = normalizeImageSrc(p.image);
              const href = `/fotky/${id}`;

              return (
                <li key={id}>
                  <Link
                    href={href}
                    className="group block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="relative aspect-4/3 w-full bg-neutral-100">
                      {img && img.startsWith("http") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt={p.name ?? ""}
                          className="h-full w-full object-cover transition group-hover:opacity-95"
                        />
                      ) : img ? (
                        <Image
                          src={img}
                          alt={p.name ?? "Fotka"}
                          fill
                          className="object-cover transition group-hover:opacity-95"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                          Bez obrázku
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="font-semibold text-neutral-900 group-hover:text-blue-800">
                        {p.name ?? "Bez názvu"}
                      </h2>
                      {p.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                          {p.description}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}

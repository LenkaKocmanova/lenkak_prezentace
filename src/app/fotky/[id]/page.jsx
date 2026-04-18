import connectDB from "@/config/database";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Property from "../../../../models/Property";
import MongooseComments from "../../../../models/Comments";
import Comments from "@/components/Comments";

export const dynamic = "force-dynamic";

function normalizeImageSrc(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
}

export default async function FotkyDetailPage(props) {
  await connectDB();
  const params = await Promise.resolve(props.params);
  const id = params?.id;
  if (!id) notFound();

  const property = await Property.findById(id).lean();
  if (!property) notFound();

  const commentsRaw = await MongooseComments.find({ property: id })
    .sort({ createdAt: -1 })
    .populate("owner", "username")
    .lean();

  const initialComments = commentsRaw.map((c) => {
    const owner = c.owner;
    const ownerId =
      owner && typeof owner === "object" && owner._id != null
        ? String(owner._id)
        : owner != null
          ? String(owner)
          : "";
    const authorName =
      owner && typeof owner === "object" && owner.username != null
        ? owner.username
        : "?";

    return {
      _id: String(c._id),
      body: c.body ?? "",
      authorName,
      ownerId,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
    };
  });

  const img = normalizeImageSrc(property.image);
  const name = property.name ?? "Bez názvu";

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="mb-4">
          <Link
            href="/fotky"
            className="text-sm font-medium text-blue-800 underline hover:text-blue-600"
          >
            ← Zpět na Fotky
          </Link>
        </p>
        <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-neutral-900">{name}</h1>
          {img ? (
            <div className="relative mx-auto mt-6 aspect-4/3 max-w-2xl overflow-hidden rounded-lg bg-neutral-100">
              {img.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={img}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                  priority
                />
              )}
            </div>
          ) : null}
          {property.description ? (
            <p className="mt-6 text-neutral-700">{property.description}</p>
          ) : null}
        </article>
        <Comments propertyId={String(id)} initialComments={initialComments} />
      </main>
      <Footer />
    </div>
  );
}

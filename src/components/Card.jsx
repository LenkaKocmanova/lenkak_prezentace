import Image from "next/image";
import Link from "next/link";
import Comments from "./Comments";

export default function Card(property) {
  return (
    <div className="border border-gray-300 rounded-md p-4">
        <Image src={property.image} alt={property.name} width={100} height={100} />
      <h1 className="text-lg font-bold">{property.name}</h1>
      <p className="text-sm text-gray-500">{property.description}</p>
      <Link href={`${property.image}`} className="text-blue-500">View</Link>
      <Comments
        propertyId={String(property._id)}
        initialComments={[]}
      />
    </div>
  );
}
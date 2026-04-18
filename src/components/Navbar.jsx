import Link from "next/link";
import NavAuth from "@/components/NavAuth";

const leftNavItems = [
  { label: "Home", href: "/" },
  { label: "Fotky", href: "/fotky" },
  { label: "Piškvorky", href: "/piskvorky" },
  //{ label: "Kontakt", href: "/kontakt" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-200 bg-blue-950/95 text-blue-50 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-wide">
          Lenka K.
        </Link>

        <ul className="flex flex-1 flex-wrap items-center justify-center gap-2 sm:gap-3">
          {leftNavItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-blue-100 transition-colors hover:bg-blue-800 hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 justify-end">
          <NavAuth />
        </div>
      </nav>
    </header>
  );
}

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-blue-200 transition-colors">
          Integridad SECOP
        </Link>
        <div className="flex gap-6">
          <Link href="/buscar" className="hover:text-blue-200 transition-colors">
            Buscar
          </Link>
          <Link href="/acerca-de" className="hover:text-blue-200 transition-colors">
            Acerca de
          </Link>
        </div>
      </div>
    </nav>
  );
}
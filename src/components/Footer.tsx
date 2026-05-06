export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
        <p>Prototipo Académico — Universidad de los Andes — 2026</p>
        <div className="mt-2 space-x-4">
          <a href="/acerca-de" className="hover:underline">Acerca de</a>
          <a href="https://www.colombiacompra.gov.co" target="_blank" className="hover:underline">
            SECOP II
          </a>
          <a href="https://polygon.technology" target="_blank" className="hover:underline">
            Polygon
          </a>
        </div>
      </div>
    </footer>
  );
}
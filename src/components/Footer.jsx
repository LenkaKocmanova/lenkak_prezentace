export default function Footer() {
  return (
    <footer className="mt-12 border-t border-blue-200 bg-blue-900 text-blue-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Lenka K. Všechna práva vyhrazena.</p>
        <p className="text-blue-200">Perníčky | Piškvorky | Kontakt</p>
      </div>
    </footer>
  );
}

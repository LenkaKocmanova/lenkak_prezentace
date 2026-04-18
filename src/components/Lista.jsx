"use client";

const Lista = ({ konecHry, znak, onNovaHra }) => {
  const NaTahu = konecHry
    ? "Konec hry"
    : znak === "X"
      ? "Na tahu X"
      : "Na tahu O";

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <nav className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700"
          onClick={onNovaHra}
        >
          Nová hra
        </button>
      </nav>
      <input
        className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-center text-sm text-neutral-900 shadow-inner"
        type="text"
        value={NaTahu}
        readOnly
        aria-live="polite"
      />
    </div>
  );
};

export default Lista;
